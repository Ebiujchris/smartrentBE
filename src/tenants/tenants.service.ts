import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTenantDto: CreateTenantDto) {
    const { email, password, fullName, phone, nationalId, emergencyContact, occupation } = createTenantDto;

    // Create user account for tenant
    const bcrypt = require('bcrypt');
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

  async findAll(userId: string) {
    // Get all tenants for properties owned by this user
    const tenants = await this.prisma.tenant.findMany({
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

    return tenants;
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
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
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const { fullName, phone, nationalId, emergencyContact, occupation } = updateTenantDto;

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

  async remove(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    await this.prisma.tenant.delete({
      where: { id },
    });

    return { message: 'Tenant deleted successfully' };
  }
}
