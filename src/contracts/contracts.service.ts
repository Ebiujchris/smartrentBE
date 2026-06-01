import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async create(landlordId: string, createContractDto: CreateContractDto) {
    // Verify tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: createContractDto.tenantId },
      include: { user: true },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const contract = await this.prisma.contract.create({
      data: {
        ...createContractDto,
        landlordId,
        startDate: new Date(createContractDto.startDate),
        endDate: new Date(createContractDto.endDate),
        rentAmount: createContractDto.rentAmount,
        deposit: createContractDto.deposit,
        terms: createContractDto.terms || [],
      },
      include: {
        landlord: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        tenant: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return contract;
  }

  async findAll(userId: string, userRole: string) {
    console.log('findAll contracts - userId:', userId, 'userRole:', userRole);
    
    if (userRole === 'TENANT') {
      // Find tenant profile
      const tenant = await this.prisma.tenant.findUnique({
        where: { userId },
      });

      console.log('Tenant profile found:', tenant ? tenant.id : 'NOT FOUND');

      if (!tenant) {
        return [];
      }

      const contracts = await this.prisma.contract.findMany({
        where: { tenantId: tenant.id },
        include: {
          landlord: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
          tenant: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      console.log('Contracts found for tenant:', contracts.length);
      return contracts;
    }

    // Landlord/Property Manager/Admin
    const contracts = await this.prisma.contract.findMany({
      where: { landlordId: userId },
      include: {
        landlord: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        tenant: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('Contracts found for landlord:', contracts.length);
    return contracts;
  }

  async findOne(id: string, userId: string, userRole: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        landlord: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        tenant: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // Check authorization
    if (userRole === 'TENANT') {
      const tenant = await this.prisma.tenant.findUnique({
        where: { userId },
      });

      if (!tenant || contract.tenantId !== tenant.id) {
        throw new ForbiddenException('Access denied');
      }
    } else if (contract.landlordId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    return contract;
  }

  async update(
    id: string,
    userId: string,
    updateContractDto: UpdateContractDto,
  ) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.landlordId !== userId) {
      throw new ForbiddenException('Only the contract creator can update it');
    }

    if (contract.status !== 'DRAFT') {
      throw new BadRequestException(
        'Only draft contracts can be updated',
      );
    }

    return this.prisma.contract.update({
      where: { id },
      data: updateContractDto,
      include: {
        landlord: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        tenant: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.landlordId !== userId) {
      throw new ForbiddenException('Only the contract creator can delete it');
    }

    if (contract.status !== 'DRAFT') {
      throw new BadRequestException('Only draft contracts can be deleted');
    }

    return this.prisma.contract.delete({
      where: { id },
    });
  }

  async sendContract(id: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        tenant: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.landlordId !== userId) {
      throw new ForbiddenException('Only the contract creator can send it');
    }

    if (contract.status !== 'DRAFT') {
      throw new BadRequestException('Contract has already been sent');
    }

    const updatedContract = await this.prisma.contract.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
      include: {
        landlord: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        tenant: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Create notification for tenant ONLY
    console.log('Creating notification for tenant:', {
      tenantUserId: contract.tenant.userId,
      tenantName: contract.tenant.user.fullName,
      landlordId: contract.landlordId,
    });

    await this.prisma.notification.create({
      data: {
        userId: contract.tenant.userId,
        title: 'New Tenancy Contract',
        message: `You have received a new tenancy contract for ${contract.propertyName} - ${contract.unitNumber}. Please review and accept.`,
        type: 'INFO',
      },
    });

    return updatedContract;
  }

  async acceptContract(id: string, userId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!tenant) {
      throw new ForbiddenException('Only tenants can accept contracts');
    }

    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        landlord: true,
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.tenantId !== tenant.id) {
      throw new ForbiddenException('You can only accept your own contracts');
    }

    if (contract.status !== 'SENT') {
      throw new BadRequestException('Contract cannot be accepted');
    }

    const updatedContract = await this.prisma.contract.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
      include: {
        landlord: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        tenant: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Create notification for landlord
    await this.prisma.notification.create({
      data: {
        userId: contract.landlordId,
        title: 'Contract Accepted',
        message: `${tenant.user.fullName} has accepted the tenancy contract for ${contract.propertyName} - ${contract.unitNumber}.`,
        type: 'SUCCESS',
      },
    });

    return updatedContract;
  }

  async rejectContract(id: string, userId: string, reason: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId },
    });

    if (!tenant) {
      throw new ForbiddenException('Only tenants can reject contracts');
    }

    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        landlord: true,
        tenant: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.tenantId !== tenant.id) {
      throw new ForbiddenException('You can only reject your own contracts');
    }

    if (contract.status !== 'SENT') {
      throw new BadRequestException('Contract cannot be rejected');
    }

    const updatedContract = await this.prisma.contract.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
      include: {
        landlord: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        tenant: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Create notification for landlord
    await this.prisma.notification.create({
      data: {
        userId: contract.landlordId,
        title: 'Contract Rejected',
        message: `${contract.tenant.user.fullName} has rejected the tenancy contract for ${contract.propertyName} - ${contract.unitNumber}. Reason: ${reason}`,
        type: 'WARNING',
      },
    });

    return updatedContract;
  }
}
