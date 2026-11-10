import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { createMonthlyRentCharges, createRentReceipt } from '../payments/rent-ledger';
import { Prisma, RentReceiptType } from '@prisma/client';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  private tenantAccessScope(user: { id: string; role: string }) {
    if (user.role === 'ADMIN') return {};
    if (user.role === 'TENANT') return { userId: user.id };
    return {
      leases: {
        some: {
          unit: { property: { ownerId: user.id } },
        },
      },
    };
  }

  async create(userId: string, createTenantDto: CreateTenantDto) {
    const {
      email,
      password,
      fullName,
      phone,
      nationalId,
      emergencyContact,
      occupation,
    } = createTenantDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    // Create user account for tenant
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phone,
        role: 'TENANT',
        tenantProfile: {
          create: {
            nationalId,
            emergencyContact,
            occupation,
          },
        },
      },
      include: {
        tenantProfile: true,
      },
    });

    return user;
  }

  async register(user: { id: string; role: string }, dto: RegisterTenantDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate < startDate) {
      throw new ConflictException('Tenancy end date must be on or after its start date');
    }

    const requiredInitialRent = new Prisma.Decimal(dto.rentAmount).mul(dto.upfrontMonths);
    if (new Prisma.Decimal(dto.initialRentAmount).lt(requiredInitialRent)) {
      throw new ConflictException(
        `Initial rent must cover at least ${dto.upfrontMonths} months`,
      );
    }
    if (new Prisma.Decimal(dto.depositReceived ?? 0).gt(dto.deposit)) {
      throw new ConflictException('Deposit received cannot exceed the agreed security deposit');
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const unit = await tx.unit.findFirst({
        where: {
          id: dto.unitId,
          ...(user.role === 'ADMIN'
            ? {}
            : { property: { ownerId: user.id } }),
        },
      });

      if (!unit) {
        throw new NotFoundException('Unit not found');
      }
      if (unit.status === 'OCCUPIED') {
        throw new ConflictException('Unit is already occupied');
      }

      const tenantUser = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          fullName: dto.fullName,
          phone: dto.phone,
          role: 'TENANT',
          tenantProfile: {
            create: {
              nationalId: dto.nationalId,
              emergencyContact: dto.emergencyContact,
              occupation: dto.occupation,
            },
          },
        },
        include: { tenantProfile: true },
      });

      const lease = await tx.lease.create({
        data: {
          tenantId: tenantUser.tenantProfile!.id,
          unitId: unit.id,
          startDate,
          endDate,
          rentAmount: dto.rentAmount,
          deposit: dto.deposit,
          upfrontMonths: dto.upfrontMonths,
          isActive: true,
        },
        include: {
          tenant: { include: { user: true } },
          unit: { include: { property: true } },
        },
      });

      const periodCount = await createMonthlyRentCharges(tx, lease);
      if (dto.upfrontMonths > periodCount) {
        throw new ConflictException(
          'Upfront months cannot exceed the number of rent periods in the tenancy',
        );
      }

      const rentReceipt = await createRentReceipt(tx, {
        leaseId: lease.id,
        tenantId: tenantUser.tenantProfile!.id,
        amount: dto.initialRentAmount,
        method: dto.initialPaymentMethod,
        paidAt: dto.initialPaidAt ? new Date(dto.initialPaidAt) : undefined,
        notes: `Initial rent advance covering at least ${dto.upfrontMonths} months`,
      });

      let depositReceipt;
      if (dto.depositReceived && dto.depositReceived > 0) {
        depositReceipt = await createRentReceipt(tx, {
          leaseId: lease.id,
          tenantId: tenantUser.tenantProfile!.id,
          amount: dto.depositReceived,
          type: RentReceiptType.DEPOSIT,
          method: dto.depositPaymentMethod ?? dto.initialPaymentMethod,
          notes: 'Security deposit received',
        });
      }

      await tx.unit.update({
        where: { id: unit.id },
        data: { status: 'OCCUPIED' },
      });

      return { tenant: tenantUser, lease, rentReceipt, depositReceipt, success: true };
    });
  }

  async findAll(userId: string) {
    // Get user to check role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let tenants;

    if (user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') {
      // Get tenants for properties owned by this landlord
      tenants = await this.prisma.tenant.findMany({
        where: {
          leases: {
            some: {
              unit: {
                property: {
                  ownerId: userId,
                },
              },
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true,
              createdAt: true,
            },
          },
          leases: {
            include: {
              unit: {
                include: {
                  property: true,
                },
              },
              rentReceipts: {
                orderBy: { paidAt: 'desc' },
              },
            },
            where: {
              unit: {
                property: {
                  ownerId: userId,
                },
              },
            },
            orderBy: {
              startDate: 'desc',
            },
          },
          payments: {
            where: {
              lease: {
                unit: {
                  property: {
                    ownerId: userId,
                  },
                },
              },
            },
            orderBy: {
              dueDate: 'desc',
            },
            take: 5,
          },
        },
      });
    } else {
      // Admin sees all tenants
      tenants = await this.prisma.tenant.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true,
              createdAt: true,
            },
          },
          leases: {
            include: {
              unit: {
                include: {
                  property: true,
                },
              },
              rentReceipts: {
                orderBy: { paidAt: 'desc' },
              },
            },
            where: {
              isActive: true,
            },
          },
          payments: {
            orderBy: {
              dueDate: 'desc',
            },
            take: 5,
          },
        },
      });
    }

    return tenants;
  }

  async findOne(id: string, user: { id: string; role: string }) {
    const ownerLeaseFilter = ['LANDLORD', 'PROPERTY_MANAGER'].includes(user.role)
      ? { unit: { property: { ownerId: user.id } } }
      : undefined;

    const tenant = await this.prisma.tenant.findFirst({
      where: { id, ...this.tenantAccessScope(user) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            createdAt: true,
          },
        },
        leases: {
          where: ownerLeaseFilter,
          include: {
            unit: {
              include: {
                property: true,
              },
            },
            payments: true,
          },
        },
        payments: {
          where: ownerLeaseFilter ? { lease: ownerLeaseFilter } : undefined,
          orderBy: {
            dueDate: 'desc',
          },
        },
        maintenanceRequests: {
          where: ownerLeaseFilter ? { unit: ownerLeaseFilter.unit } : undefined,
          orderBy: {
            reportedAt: 'desc',
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async update(
    id: string,
    updateTenantDto: UpdateTenantDto,
    user: { id: string; role: string },
  ) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id, ...this.tenantAccessScope(user) },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const { fullName, phone, nationalId, emergencyContact, occupation } =
      updateTenantDto;

    const updated = await this.prisma.tenant.update({
      where: { id },
      data: {
        nationalId,
        emergencyContact,
        occupation,
        user: {
          update: {
            fullName,
            phone,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return updated;
  }

  async remove(id: string, user: { id: string; role: string }) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id, ...this.tenantAccessScope(user) },
      include: {
        _count: {
          select: {
            leases: true,
            payments: true,
            maintenanceRequests: true,
            contracts: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    if (
      tenant._count.leases > 0 ||
      tenant._count.payments > 0 ||
      tenant._count.maintenanceRequests > 0 ||
      tenant._count.contracts > 0
    ) {
      throw new ConflictException(
        'Tenant has tenancy, payment, maintenance, or agreement history. End the tenancy instead of deleting this record.',
      );
    }

    await this.prisma.tenant.delete({
      where: { id },
    });

    return { message: 'Tenant deleted successfully' };
  }

  async getCurrentTenant(userId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            createdAt: true,
          },
        },
        leases: {
          include: {
            unit: {
              include: {
                property: true,
              },
            },
            payments: true,
          },
        },
        payments: {
          orderBy: {
            dueDate: 'desc',
          },
        },
        maintenanceRequests: {
          orderBy: {
            reportedAt: 'desc',
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return tenant;
  }
}
