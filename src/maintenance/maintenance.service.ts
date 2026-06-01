import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, user: any, createMaintenanceDto: CreateMaintenanceDto) {
    const { unitId, title, description, priority, tenantId } = createMaintenanceDto;

    let finalTenantId: string;

    if (user.role === 'TENANT') {
      finalTenantId = user.tenantProfile.id;

      const tenant = await this.prisma.tenant.findUnique({
        where: { userId: user.id },
      });
      if (!tenant) {
        throw new NotFoundException('Tenant profile not found');
      }
    } else {
      finalTenantId = tenantId;
    }

    const request = await this.prisma.maintenanceRequest.create({
      data: {
        unitId,
        tenantId,
        title,
        description,
        priority: (priority as any) || 'MEDIUM',
        status: 'PENDING',
      },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
        tenant: {
          include: {
            user: true,
          },
        },
      },
    });

    return request;
  }

  async findAll(userId: string, user: any) {
    if (user.role === 'TENANT') {
      const tenant = await this.prisma.tenant.findUnique({
        where: { userId },
      });

      if (!tenant) {
        throw new NotFoundException('Tenant profile not found');
      }

      const requests = await this.prisma.maintenanceRequest.findMany({
        where: {
          tenantId: tenant.id,
        },
        include: {
          unit: {
            include: {
              property: true,
            },
          },
          tenant: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          reportedAt: 'desc',
        },
      });

      return requests;
    }

    const requests = await this.prisma.maintenanceRequest.findMany({
      include: {
        unit: {
          include: {
            property: true,
          },
        },
        tenant: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        reportedAt: 'desc',
      },
    });

    return requests;
  }

  async findOne(id: string, user: any) {
    const request = await this.prisma.maintenanceRequest.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
        tenant: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Maintenance request not found');
    }

    if (user.role === 'TENANT' && request.tenant.userId !== user.id) {
      throw new ForbiddenException('You can only view your own maintenance requests');
    }

    return request;
  }

  async update(id: string, updateMaintenanceDto: UpdateMaintenanceDto) {
    const request = await this.prisma.maintenanceRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Maintenance request not found');
    }

    const updated = await this.prisma.maintenanceRequest.update({
      where: { id },
      data: {
        title: updateMaintenanceDto.title,
        description: updateMaintenanceDto.description,
        priority: updateMaintenanceDto.priority as any,
        status: updateMaintenanceDto.status as any,
        notes: updateMaintenanceDto.notes,
        resolvedAt: updateMaintenanceDto.status === 'COMPLETED' ? new Date() : undefined,
      },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
        tenant: {
          include: {
            user: true,
          },
        },
      },
    });

    return updated;
  }

  async updateStatus(id: string, status: string, notes?: string) {
    const request = await this.prisma.maintenanceRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Maintenance request not found');
    }

    const updated = await this.prisma.maintenanceRequest.update({
      where: { id },
      data: {
        status: status as any,
        notes,
        resolvedAt: status === 'COMPLETED' ? new Date() : undefined,
      },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
        tenant: {
          include: {
            user: true,
          },
        },
      },
    });

    return updated;
  }

  async remove(id: string) {
    const request = await this.prisma.maintenanceRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Maintenance request not found');
    }

    await this.prisma.maintenanceRequest.delete({
      where: { id },
    });

    return { message: 'Maintenance request deleted successfully' };
  }
}
