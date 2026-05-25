"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MaintenanceService = class MaintenanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createMaintenanceDto) {
        const { unitId, tenantId, title, description, priority } = createMaintenanceDto;
        const request = await this.prisma.maintenanceRequest.create({
            data: {
                unitId,
                tenantId,
                title,
                description,
                priority: priority || 'MEDIUM',
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
    async findAll(userId) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Maintenance request not found');
        }
        return request;
    }
    async update(id, updateMaintenanceDto) {
        const request = await this.prisma.maintenanceRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException('Maintenance request not found');
        }
        const updated = await this.prisma.maintenanceRequest.update({
            where: { id },
            data: {
                title: updateMaintenanceDto.title,
                description: updateMaintenanceDto.description,
                priority: updateMaintenanceDto.priority,
                status: updateMaintenanceDto.status,
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
    async updateStatus(id, status, notes) {
        const request = await this.prisma.maintenanceRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException('Maintenance request not found');
        }
        const updated = await this.prisma.maintenanceRequest.update({
            where: { id },
            data: {
                status: status,
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
    async remove(id) {
        const request = await this.prisma.maintenanceRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException('Maintenance request not found');
        }
        await this.prisma.maintenanceRequest.delete({
            where: { id },
        });
        return { message: 'Maintenance request deleted successfully' };
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map