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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createPaymentDto) {
        const { leaseId, tenantId, amount, dueDate, method, reference, notes } = createPaymentDto;
        const payment = await this.prisma.payment.create({
            data: {
                leaseId,
                tenantId,
                amount,
                dueDate: new Date(dueDate),
                method: method,
                reference,
                notes,
                status: 'PENDING',
            },
            include: {
                lease: {
                    include: {
                        unit: {
                            include: {
                                property: true,
                            },
                        },
                    },
                },
                tenant: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        return payment;
    }
    async findAll(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                tenantProfile: true,
                properties: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        let payments;
        if (user.role === 'TENANT' && user.tenantProfile) {
            payments = await this.prisma.payment.findMany({
                where: {
                    tenantId: user.tenantProfile.id,
                },
                include: {
                    lease: {
                        include: {
                            unit: {
                                include: {
                                    property: true,
                                },
                            },
                        },
                    },
                    tenant: {
                        include: {
                            user: true,
                        },
                    },
                },
                orderBy: {
                    dueDate: 'desc',
                },
            });
        }
        else if (user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') {
            payments = await this.prisma.payment.findMany({
                where: {
                    lease: {
                        unit: {
                            property: {
                                ownerId: userId,
                            },
                        },
                    },
                },
                include: {
                    lease: {
                        include: {
                            unit: {
                                include: {
                                    property: true,
                                },
                            },
                        },
                    },
                    tenant: {
                        include: {
                            user: true,
                        },
                    },
                },
                orderBy: {
                    dueDate: 'desc',
                },
            });
        }
        else {
            payments = await this.prisma.payment.findMany({
                include: {
                    lease: {
                        include: {
                            unit: {
                                include: {
                                    property: true,
                                },
                            },
                        },
                    },
                    tenant: {
                        include: {
                            user: true,
                        },
                    },
                },
                orderBy: {
                    dueDate: 'desc',
                },
            });
        }
        return payments.map((payment) => ({
            ...payment,
            amount: payment.amount.toNumber(),
            lease: {
                ...payment.lease,
                rentAmount: payment.lease.rentAmount.toNumber(),
                deposit: payment.lease.deposit.toNumber(),
            },
        }));
    }
    async findByTenantId(tenantId) {
        const payments = await this.prisma.payment.findMany({
            where: { tenantId },
            include: {
                lease: {
                    include: {
                        unit: {
                            include: {
                                property: true,
                            },
                        },
                    },
                },
                tenant: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                dueDate: 'desc',
            },
        });
        return payments;
    }
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                lease: {
                    include: {
                        unit: {
                            include: {
                                property: true,
                            },
                        },
                    },
                },
                tenant: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async update(id, updatePaymentDto) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const updated = await this.prisma.payment.update({
            where: { id },
            data: {
                amount: updatePaymentDto.amount,
                dueDate: updatePaymentDto.dueDate
                    ? new Date(updatePaymentDto.dueDate)
                    : undefined,
                paidDate: updatePaymentDto.paidDate
                    ? new Date(updatePaymentDto.paidDate)
                    : undefined,
                status: updatePaymentDto.status,
                method: updatePaymentDto.method,
                reference: updatePaymentDto.reference,
                notes: updatePaymentDto.notes,
            },
            include: {
                lease: {
                    include: {
                        unit: {
                            include: {
                                property: true,
                            },
                        },
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
    async recordPayment(id, method, reference, notes) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const updated = await this.prisma.payment.update({
            where: { id },
            data: {
                status: 'PAID',
                paidDate: new Date(),
                method: method,
                reference,
                notes,
            },
            include: {
                lease: {
                    include: {
                        unit: {
                            include: {
                                property: true,
                            },
                        },
                    },
                },
                tenant: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        return {
            ...updated,
            amount: updated.amount.toNumber(),
            lease: {
                ...updated.lease,
                rentAmount: updated.lease.rentAmount.toNumber(),
                deposit: updated.lease.deposit.toNumber(),
            },
        };
    }
    async getOverduePayments(userId) {
        const today = new Date();
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const whereClause = {
            status: {
                in: ['PENDING', 'OVERDUE'],
            },
            dueDate: {
                lt: today,
            },
        };
        if (user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') {
            whereClause.lease = {
                unit: {
                    property: {
                        ownerId: userId,
                    },
                },
            };
        }
        const overduePayments = await this.prisma.payment.findMany({
            where: whereClause,
            include: {
                lease: {
                    include: {
                        unit: {
                            include: {
                                property: true,
                            },
                        },
                    },
                },
                tenant: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                dueDate: 'asc',
            },
        });
        for (const payment of overduePayments) {
            if (payment.status === 'PENDING') {
                await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'OVERDUE' },
                });
            }
        }
        return overduePayments;
    }
    async remove(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        await this.prisma.payment.delete({
            where: { id },
        });
        return { message: 'Payment deleted successfully' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map