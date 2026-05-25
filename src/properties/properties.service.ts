import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.property.findMany({
      where: { ownerId: userId },
      include: {
        units: true,
        _count: {
          select: { units: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        units: {
          include: {
            leases: {
              where: { isActive: true },
              include: {
                tenant: {
                  include: {
                    user: {
                      select: {
                        fullName: true,
                        email: true,
                        phone: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return property;
  }

  async create(data: any, userId: string) {
    return this.prisma.property.create({
      data: {
        name: data.name,
        address: data.address,
        description: data.description,
        ownerId: userId,
      },
    });
  }

  async update(id: string, data: any, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.property.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        description: data.description,
      },
    });
  }

  async remove(id: string, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.property.delete({
      where: { id },
    });

    return { message: 'Property deleted successfully' };
  }

  async getUnits(propertyId: string, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.unit.findMany({
      where: { propertyId },
      include: {
        leases: {
          where: { isActive: true },
          include: {
            tenant: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { unitNumber: 'asc' },
    });
  }

  async createUnit(propertyId: string, data: any, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.unit.create({
      data: {
        unitNumber: data.unitNumber,
        floor: data.floor,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        size: data.size,
        rentAmount: data.rentAmount,
        status: data.status || 'VACANT',
        propertyId,
      },
    });
  }
}
