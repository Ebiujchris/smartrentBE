import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';

@Injectable()
export class LeasesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createLeaseDto: CreateLeaseDto) {
    const { tenantId, unitId, startDate, endDate, rentAmount, deposit } = createLeaseDto;

    // Check if unit exists and is vacant
    const unit = await this.prisma.unit.findUnique({
      where: { id: unitId },
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

    // Create lease and update unit status
    const lease = await this.prisma.lease.create({
      data: {
        tenantId,
        unitId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rentAmount,
        deposit,
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

    // Update unit status to OCCUPIED
    await this.prisma.unit.update({
      where: { id: unitId },
      data: { status: 'OCCUPIED' },
    });

    return lease;
  }

  async findAll(userId: string) {
    const leases = await this.prisma.lease.findMany({
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return leases;
  }

  async findOne(id: string) {
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
      },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    return lease;
  }

  async update(id: string, updateLeaseDto: UpdateLeaseDto) {
    const lease = await this.prisma.lease.findUnique({
      where: { id },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    const updated = await this.prisma.lease.update({
      where: { id },
      data: {
        ...updateLeaseDto,
        startDate: updateLeaseDto.startDate ? new Date(updateLeaseDto.startDate) : undefined,
        endDate: updateLeaseDto.endDate ? new Date(updateLeaseDto.endDate) : undefined,
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

    return updated;
  }

  async terminate(id: string) {
    const lease = await this.prisma.lease.findUnique({
      where: { id },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
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

  async remove(id: string) {
    const lease = await this.prisma.lease.findUnique({
      where: { id },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    await this.prisma.lease.delete({
      where: { id },
    });

    return { message: 'Lease deleted successfully' };
  }
}
