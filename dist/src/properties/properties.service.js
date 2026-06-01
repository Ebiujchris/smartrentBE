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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PropertiesService = class PropertiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        const properties = await this.prisma.property.findMany({
            where: { ownerId: userId },
            include: {
                units: true,
                _count: {
                    select: { units: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return properties.map((property) => ({
            ...property,
            units: property.units.map((unit) => ({
                ...unit,
                rentAmount: unit.rentAmount.toNumber(),
            })),
        }));
    }
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return {
            ...property,
            units: property.units.map((unit) => ({
                ...unit,
                rentAmount: unit.rentAmount.toNumber(),
                leases: unit.leases.map((lease) => ({
                    ...lease,
                    rentAmount: lease.rentAmount.toNumber(),
                    deposit: lease.deposit.toNumber(),
                })),
            })),
        };
    }
    async create(data, userId) {
        return this.prisma.property.create({
            data: {
                name: data.name,
                address: data.address,
                description: data.description,
                ownerId: userId,
            },
        });
    }
    async update(id, data, userId) {
        const property = await this.prisma.property.findUnique({
            where: { id },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async remove(id, userId) {
        const property = await this.prisma.property.findUnique({
            where: { id },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.property.delete({
            where: { id },
        });
        return { message: 'Property deleted successfully' };
    }
    async getUnits(propertyId, userId) {
        const property = await this.prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const units = await this.prisma.unit.findMany({
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
        return units.map((unit) => ({
            ...unit,
            rentAmount: unit.rentAmount.toNumber(),
            leases: unit.leases.map((lease) => ({
                ...lease,
                rentAmount: lease.rentAmount.toNumber(),
                deposit: lease.deposit.toNumber(),
            })),
        }));
    }
    async createUnit(propertyId, data, userId) {
        const property = await this.prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async getUnitById(unitId, userId) {
        const unit = await this.prisma.unit.findUnique({
            where: { id: unitId },
            include: {
                property: true,
                leases: {
                    include: {
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
                        payments: {
                            orderBy: { dueDate: 'desc' },
                            take: 10,
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                maintenanceRequests: {
                    orderBy: { reportedAt: 'desc' },
                    take: 5,
                },
            },
        });
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        if (unit.property.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return unit;
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map