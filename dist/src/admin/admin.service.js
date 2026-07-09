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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, totalLandlords, totalTenants, totalProperties, totalUnits, occupiedUnits, totalSubscriptions, activeSubscriptions, trialSubscriptions, expiredSubscriptions, totalPayments, totalRevenue, recentUsers, recentPayments, unreadMessages,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: 'LANDLORD' } }),
            this.prisma.user.count({ where: { role: 'TENANT' } }),
            this.prisma.property.count(),
            this.prisma.unit.count(),
            this.prisma.unit.count({ where: { status: 'OCCUPIED' } }),
            this.prisma.subscription.count(),
            this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
            this.prisma.subscription.count({ where: { status: 'TRIAL' } }),
            this.prisma.subscription.count({ where: { status: 'EXPIRED' } }),
            this.prisma.payment.count(),
            this.prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'PAID' },
            }),
            this.prisma.user.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: { id: true, fullName: true, email: true, role: true, createdAt: true, isSuspended: true },
            }),
            this.prisma.payment.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    tenant: { include: { user: { select: { fullName: true } } } },
                    lease: { include: { unit: { include: { property: { select: { name: true } } } } } },
                },
            }),
            this.prisma.supportMessage.count({
                where: {
                    receiver: { role: 'ADMIN' },
                    isRead: false,
                },
            }).catch(() => 0),
        ]);
        return {
            users: {
                total: totalUsers,
                landlords: totalLandlords,
                tenants: totalTenants,
            },
            properties: {
                total: totalProperties,
                units: totalUnits,
                occupied: occupiedUnits,
                vacant: totalUnits - occupiedUnits,
                occupancyRate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
            },
            subscriptions: {
                total: totalSubscriptions,
                active: activeSubscriptions,
                trial: trialSubscriptions,
                expired: expiredSubscriptions,
            },
            payments: {
                total: totalPayments,
                totalRevenue: totalRevenue._sum.amount || 0,
            },
            unreadMessages,
            recentUsers,
            recentPayments,
        };
    }
    async getUserGrowthData() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const users = await this.prisma.user.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true, role: true },
            orderBy: { createdAt: 'asc' },
        });
        const monthlyData = {};
        users.forEach((user) => {
            const monthKey = user.createdAt.toISOString().slice(0, 7);
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { landlords: 0, tenants: 0, total: 0 };
            }
            monthlyData[monthKey].total++;
            if (user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') {
                monthlyData[monthKey].landlords++;
            }
            else if (user.role === 'TENANT') {
                monthlyData[monthKey].tenants++;
            }
        });
        return Object.entries(monthlyData).map(([month, data]) => ({
            month,
            ...data,
        }));
    }
    async getUsers(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.search) {
            where.OR = [
                { fullName: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
                { phone: { contains: query.search } },
            ];
        }
        if (query.role) {
            where.role = query.role;
        }
        if (query.status === 'suspended') {
            where.isSuspended = true;
        }
        else if (query.status === 'active') {
            where.isSuspended = false;
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    role: true,
                    isSuspended: true,
                    createdAt: true,
                    updatedAt: true,
                    subscription: {
                        select: {
                            plan: true,
                            status: true,
                            maxUnits: true,
                            amount: true,
                            trialEndsAt: true,
                            currentPeriodEnd: true,
                        },
                    },
                    _count: {
                        select: {
                            properties: true,
                        },
                    },
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                isSuspended: true,
                createdAt: true,
                updatedAt: true,
                subscription: true,
                tenantProfile: {
                    include: {
                        leases: {
                            include: {
                                unit: { include: { property: true } },
                            },
                        },
                    },
                },
                properties: {
                    include: {
                        units: {
                            select: {
                                id: true,
                                unitNumber: true,
                                status: true,
                                rentAmount: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        properties: true,
                        notifications: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUser(id, updateDto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prisma.user.update({
            where: { id },
            data: updateDto,
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                isSuspended: true,
                updatedAt: true,
            },
        });
    }
    async suspendUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role === 'ADMIN')
            throw new common_1.BadRequestException('Cannot suspend an admin');
        return this.prisma.user.update({
            where: { id },
            data: { isSuspended: true },
            select: { id: true, fullName: true, isSuspended: true },
        });
    }
    async unsuspendUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { isSuspended: false },
            select: { id: true, fullName: true, isSuspended: true },
        });
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role === 'ADMIN')
            throw new common_1.BadRequestException('Cannot delete an admin account');
        await this.prisma.user.delete({ where: { id } });
        return { message: `User ${user.fullName} has been deleted` };
    }
    async getSubscriptions(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.plan)
            where.plan = query.plan;
        if (query.status)
            where.status = query.status;
        const [subscriptions, total] = await Promise.all([
            this.prisma.subscription.findMany({
                where,
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            phone: true,
                            isSuspended: true,
                        },
                    },
                },
            }),
            this.prisma.subscription.count({ where }),
        ]);
        return {
            subscriptions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateSubscription(userId, dto) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found for this user');
        }
        const data = {};
        if (dto.plan)
            data.plan = dto.plan;
        if (dto.status)
            data.status = dto.status;
        if (dto.maxUnits !== undefined)
            data.maxUnits = dto.maxUnits;
        if (dto.amount !== undefined)
            data.amount = dto.amount;
        if (dto.trialEndsAt)
            data.trialEndsAt = new Date(dto.trialEndsAt);
        if (dto.currentPeriodEnd)
            data.currentPeriodEnd = new Date(dto.currentPeriodEnd);
        if (dto.status === 'ACTIVE') {
            const now = new Date();
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            data.currentPeriodStart = now;
            data.currentPeriodEnd = dto.currentPeriodEnd ? new Date(dto.currentPeriodEnd) : oneYearFromNow;
            if (dto.plan || subscription.plan) {
                const plan = dto.plan || subscription.plan;
                switch (plan) {
                    case 'STARTER':
                        data.maxUnits = data.maxUnits ?? 7;
                        data.amount = data.amount ?? 75000;
                        break;
                    case 'PROFESSIONAL':
                        data.maxUnits = data.maxUnits ?? 30;
                        data.amount = data.amount ?? 150000;
                        break;
                    case 'PREMIUM':
                        data.maxUnits = data.maxUnits ?? 9999;
                        data.amount = data.amount ?? 300000;
                        break;
                }
            }
        }
        return this.prisma.subscription.update({
            where: { userId },
            data,
            include: {
                user: {
                    select: { id: true, fullName: true, email: true },
                },
            },
        });
    }
    async getMessages(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {
            receiver: { role: 'ADMIN' },
            parentId: null,
        };
        if (query.unreadOnly) {
            where.isRead = false;
        }
        const [messages, total] = await Promise.all([
            this.prisma.supportMessage.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            role: true,
                        },
                    },
                    replies: {
                        orderBy: { createdAt: 'asc' },
                        include: {
                            sender: {
                                select: { id: true, fullName: true, role: true },
                            },
                        },
                    },
                    _count: {
                        select: { replies: true },
                    },
                },
            }),
            this.prisma.supportMessage.count({ where }),
        ]);
        return {
            messages,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async markMessageAsRead(id) {
        const message = await this.prisma.supportMessage.findUnique({
            where: { id },
        });
        if (!message)
            throw new common_1.NotFoundException('Message not found');
        return this.prisma.supportMessage.update({
            where: { id },
            data: { isRead: true },
        });
    }
    async replyToMessage(messageId, adminId, dto) {
        const originalMessage = await this.prisma.supportMessage.findUnique({
            where: { id: messageId },
        });
        if (!originalMessage)
            throw new common_1.NotFoundException('Message not found');
        await this.prisma.supportMessage.update({
            where: { id: messageId },
            data: { isRead: true },
        });
        const reply = await this.prisma.supportMessage.create({
            data: {
                senderId: adminId,
                receiverId: originalMessage.senderId,
                subject: dto.subject || `Re: ${originalMessage.subject || 'Support'}`,
                content: dto.content,
                parentId: messageId,
            },
            include: {
                sender: {
                    select: { id: true, fullName: true, role: true },
                },
            },
        });
        await this.prisma.notification.create({
            data: {
                userId: originalMessage.senderId,
                title: 'Admin Reply',
                message: dto.content.substring(0, 200),
                type: 'INFO',
            },
        });
        return reply;
    }
    async getProperties(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { address: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [properties, total] = await Promise.all([
            this.prisma.property.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    owner: {
                        select: { id: true, fullName: true, email: true },
                    },
                    units: {
                        select: { id: true, unitNumber: true, status: true, rentAmount: true },
                    },
                },
            }),
            this.prisma.property.count({ where }),
        ]);
        return {
            properties: properties.map((p) => ({
                ...p,
                totalUnits: p.units.length,
                occupiedUnits: p.units.filter((u) => u.status === 'OCCUPIED').length,
                vacantUnits: p.units.filter((u) => u.status === 'VACANT').length,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getPayments(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        const [payments, total, revenueAgg] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    tenant: {
                        include: {
                            user: { select: { fullName: true, email: true } },
                        },
                    },
                    lease: {
                        include: {
                            unit: {
                                include: {
                                    property: { select: { name: true, address: true } },
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.payment.count({ where }),
            this.prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'PAID' },
            }),
        ]);
        return {
            payments,
            totalRevenue: revenueAgg._sum.amount || 0,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getActivityLog(limit = 30) {
        const [recentUsers, recentPayments, recentMaintenance] = await Promise.all([
            this.prisma.user.findMany({
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: { id: true, fullName: true, role: true, createdAt: true },
            }),
            this.prisma.payment.findMany({
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    tenant: { include: { user: { select: { fullName: true } } } },
                },
            }),
            this.prisma.maintenanceRequest.findMany({
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: { id: true, title: true, status: true, createdAt: true },
            }),
        ]);
        const activities = [
            ...recentUsers.map((u) => ({
                type: 'registration',
                description: `${u.fullName} registered as ${u.role}`,
                timestamp: u.createdAt,
                id: u.id,
            })),
            ...recentPayments.map((p) => ({
                type: 'payment',
                description: `Payment of ${p.amount} UGX by ${p.tenant?.user?.fullName || 'Unknown'}`,
                timestamp: p.createdAt,
                id: p.id,
            })),
            ...recentMaintenance.map((m) => ({
                type: 'maintenance',
                description: `Maintenance: ${m.title} (${m.status})`,
                timestamp: m.createdAt,
                id: m.id,
            })),
        ];
        activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        return activities.slice(0, limit);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map