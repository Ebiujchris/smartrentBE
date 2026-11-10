import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { PaymentMethod, Prisma, RentReceiptType } from '@prisma/client';
import { createMonthlyRentCharges, createRentReceipt } from '../payments/rent-ledger';

@Injectable()
export class LeasesService {
  constructor(private prisma: PrismaService) {}

  async create(user: { id: string; role: string }, createLeaseDto: CreateLeaseDto) {
    const { tenantId, unitId, startDate, endDate, rentAmount, deposit } =
      createLeaseDto;

    console.log('Creating lease with dates:', { startDate, endDate, type: typeof startDate });

    // Check if unit exists and is vacant
    const unit = await this.prisma.unit.findFirst({
      where: {
        id: unitId,
        ...(user.role === 'ADMIN'
          ? {}
          : { property: { ownerId: user.id } }),
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (unit.status === 'OCCUPIED') {
      throw new BadRequestException('Unit is already occupied');
    }

    // Check if tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Convert dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    if (parsedEndDate < parsedStartDate) {
      throw new BadRequestException('Lease end date must be on or after its start date');
    }
    const requiredInitialRent = new Prisma.Decimal(rentAmount).mul(createLeaseDto.upfrontMonths);
    if (new Prisma.Decimal(createLeaseDto.initialRentAmount).lt(requiredInitialRent)) {
      throw new BadRequestException(
        `Initial rent must cover at least ${createLeaseDto.upfrontMonths} months`,
      );
    }
    if (new Prisma.Decimal(createLeaseDto.depositReceived ?? 0).gt(deposit)) {
      throw new BadRequestException('Deposit received cannot exceed the agreed security deposit');
    }

    console.log('Parsed dates:', { 
      parsedStartDate, 
      parsedEndDate,
      startDateValid: !isNaN(parsedStartDate.getTime()),
      endDateValid: !isNaN(parsedEndDate.getTime())
    });

    // Create lease and update unit status atomically
    const lease = await this.prisma.$transaction(async (tx) => {
      const createdLease = await tx.lease.create({
        data: {
          tenantId,
          unitId,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          rentAmount,
          deposit,
          upfrontMonths: createLeaseDto.upfrontMonths,
          isActive: true,
        },
        include: {
          tenant: {
            include: {
              user: true,
            },
          },
          unit: {
            include: {
              property: true,
            },
          },
        },
      });

      const periodCount = await createMonthlyRentCharges(tx, createdLease);
      if (createLeaseDto.upfrontMonths > periodCount) {
        throw new BadRequestException(
          'Upfront months cannot exceed the number of rent periods in the tenancy',
        );
      }

      await createRentReceipt(tx, {
        leaseId: createdLease.id,
        tenantId,
        amount: createLeaseDto.initialRentAmount,
        method: createLeaseDto.initialPaymentMethod,
        paidAt: createLeaseDto.initialPaidAt
          ? new Date(createLeaseDto.initialPaidAt)
          : undefined,
        notes: `Initial rent advance covering at least ${createLeaseDto.upfrontMonths} months`,
      });

      if (createLeaseDto.depositReceived && createLeaseDto.depositReceived > 0) {
        await createRentReceipt(tx, {
          leaseId: createdLease.id,
          tenantId,
          amount: createLeaseDto.depositReceived,
          type: RentReceiptType.DEPOSIT,
          method: createLeaseDto.depositPaymentMethod ?? createLeaseDto.initialPaymentMethod as PaymentMethod,
          notes: 'Security deposit received',
        });
      }

      console.log('Lease created:', { 
        id: createdLease.id, 
        startDate: createdLease.startDate,
        endDate: createdLease.endDate 
      });

      await tx.unit.update({
        where: { id: unitId },
        data: { status: 'OCCUPIED' },
      });

      return createdLease;
    });

    return lease;
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let whereClause = {};

    if (user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') {
      whereClause = {
        unit: {
          property: {
            ownerId: userId,
          },
        },
      };
    }

    const leases = await this.prisma.lease.findMany({
      where: whereClause,
      include: {
        tenant: {
          include: {
            user: true,
          },
        },
        unit: {
          include: {
            property: true,
          },
        },
        payments: true,
        rentReceipts: { orderBy: { paidAt: 'desc' } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return leases;
  }

  async findOne(id: string, user: any) {
    const lease = await this.prisma.lease.findUnique({
      where: { id },
      include: {
        tenant: {
          include: {
            user: true,
          },
        },
        unit: {
          include: {
            property: true,
          },
        },
        payments: {
          orderBy: {
            dueDate: 'desc',
          },
        },
        rentReceipts: { orderBy: { paidAt: 'desc' } },
      },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    if ((user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') && lease.unit.property.ownerId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return lease;
  }

  async update(id: string, updateLeaseDto: UpdateLeaseDto, user: any) {
    const lease = await this.prisma.lease.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    if ((user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') && lease.unit.property.ownerId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.lease.update({
        where: { id },
        data: {
          ...updateLeaseDto,
          startDate: updateLeaseDto.startDate
            ? new Date(updateLeaseDto.startDate)
            : undefined,
          endDate: updateLeaseDto.endDate
            ? new Date(updateLeaseDto.endDate)
            : undefined,
        },
      });

      if (updated.endDate > lease.endDate) {
        await createMonthlyRentCharges(tx, updated);
      }

      return tx.lease.findUniqueOrThrow({
        where: { id },
        include: {
          tenant: {
            include: {
              user: true,
            },
          },
          unit: {
            include: {
              property: true,
            },
          },
        },
      });
    });
  }

  async terminate(id: string, user: any) {
    const lease = await this.prisma.lease.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    if ((user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') && lease.unit.property.ownerId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    // Deactivate lease and set unit to vacant
    const updated = await this.prisma.lease.update({
      where: { id },
      data: { isActive: false },
    });

    await this.prisma.unit.update({
      where: { id: lease.unitId },
      data: { status: 'VACANT' },
    });

    return updated;
  }

  async remove(id: string, user: any) {
    const lease = await this.prisma.lease.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    if ((user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') && lease.unit.property.ownerId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.lease.delete({
      where: { id },
    });

    return { message: 'Lease deleted successfully' };
  }
}
