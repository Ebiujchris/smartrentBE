import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UnitStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async update(unitId: string, userId: string, data: UpdateUnitDto) {
    const unit = await this.prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        property: true,
        leases: {
          where: { isActive: true },
          take: 1,
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (unit.property.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (data.status === UnitStatus.VACANT && unit.leases.length > 0) {
      await this.prisma.lease.updateMany({
        where: {
          unitId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    if (data.status === UnitStatus.OCCUPIED && unit.leases.length === 0) {
      throw new BadRequestException('Cannot mark unit as occupied without an active lease');
    }

    return this.prisma.unit.update({
      where: { id: unitId },
      data: {
        unitNumber: data.unitNumber,
        floor: data.floor,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        size: data.size,
        rentAmount: data.rentAmount,
        status: data.status,
      },
    });
  }
}
