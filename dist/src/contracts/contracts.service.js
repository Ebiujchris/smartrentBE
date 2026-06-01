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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContractsService = class ContractsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(landlordId, createContractDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: createContractDto.tenantId },
            include: { user: true },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
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
    async findAll(userId, userRole) {
        console.log('findAll contracts - userId:', userId, 'userRole:', userRole);
        if (userRole === 'TENANT') {
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
    async findOne(id, userId, userRole) {
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
            throw new common_1.NotFoundException('Contract not found');
        }
        if (userRole === 'TENANT') {
            const tenant = await this.prisma.tenant.findUnique({
                where: { userId },
            });
            if (!tenant || contract.tenantId !== tenant.id) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        else if (contract.landlordId !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        return contract;
    }
    async update(id, userId, updateContractDto) {
        const contract = await this.prisma.contract.findUnique({
            where: { id },
        });
        if (!contract) {
            throw new common_1.NotFoundException('Contract not found');
        }
        if (contract.landlordId !== userId) {
            throw new common_1.ForbiddenException('Only the contract creator can update it');
        }
        if (contract.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Only draft contracts can be updated');
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
    async delete(id, userId) {
        const contract = await this.prisma.contract.findUnique({
            where: { id },
        });
        if (!contract) {
            throw new common_1.NotFoundException('Contract not found');
        }
        if (contract.landlordId !== userId) {
            throw new common_1.ForbiddenException('Only the contract creator can delete it');
        }
        if (contract.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Only draft contracts can be deleted');
        }
        return this.prisma.contract.delete({
            where: { id },
        });
    }
    async sendContract(id, userId) {
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
            throw new common_1.NotFoundException('Contract not found');
        }
        if (contract.landlordId !== userId) {
            throw new common_1.ForbiddenException('Only the contract creator can send it');
        }
        if (contract.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Contract has already been sent');
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
    async acceptContract(id, userId) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { userId },
            include: {
                user: true,
            },
        });
        if (!tenant) {
            throw new common_1.ForbiddenException('Only tenants can accept contracts');
        }
        const contract = await this.prisma.contract.findUnique({
            where: { id },
            include: {
                landlord: true,
            },
        });
        if (!contract) {
            throw new common_1.NotFoundException('Contract not found');
        }
        if (contract.tenantId !== tenant.id) {
            throw new common_1.ForbiddenException('You can only accept your own contracts');
        }
        if (contract.status !== 'SENT') {
            throw new common_1.BadRequestException('Contract cannot be accepted');
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
    async rejectContract(id, userId, reason) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { userId },
        });
        if (!tenant) {
            throw new common_1.ForbiddenException('Only tenants can reject contracts');
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
            throw new common_1.NotFoundException('Contract not found');
        }
        if (contract.tenantId !== tenant.id) {
            throw new common_1.ForbiddenException('You can only reject your own contracts');
        }
        if (contract.status !== 'SENT') {
            throw new common_1.BadRequestException('Contract cannot be rejected');
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
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map