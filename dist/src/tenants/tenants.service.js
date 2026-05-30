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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TenantsService = class TenantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createTenantDto) {
        const { email, password, fullName, phone, nationalId, emergencyContact, occupation, } = createTenantDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('A user with this email already exists');
        }
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
    async findAll(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        let tenants;
        if (user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') {
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
                        },
                        where: {
                            isActive: true,
                            unit: {
                                property: {
                                    ownerId: userId,
                                },
                            },
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
        }
        else {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Tenant not found');
        }
        return tenant;
    }
    async update(id, updateTenantDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
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
    async remove(id) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        await this.prisma.tenant.delete({
            where: { id },
        });
        return { message: 'Tenant deleted successfully' };
    }
    async removeByUserId(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return { message: 'User not found, nothing to rollback' };
        }
        await this.prisma.user.delete({ where: { id: userId } });
        return { message: 'Rollback successful — user and tenant profile removed' };
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map