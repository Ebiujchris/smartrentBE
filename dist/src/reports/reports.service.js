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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview(userId) {
        const [properties, units, tenants, payments] = await Promise.all([
            this.prisma.property.count({ where: { ownerId: userId } }),
            this.prisma.unit.count({
                where: { property: { ownerId: userId } },
            }),
            this.prisma.tenant.count({
                where: {
                    leases: {
                        some: {
                            unit: { property: { ownerId: userId } },
                            isActive: true,
                        },
                    },
                },
            }),
            this.prisma.payment.aggregate({
                where: {
                    lease: { unit: { property: { ownerId: userId } } },
                    status: 'PAID',
                },
                _sum: { amount: true },
            }),
        ]);
        const maintenanceRequests = await this.prisma.maintenanceRequest.count({
            where: {
                unit: { property: { ownerId: userId } },
                status: { in: ['PENDING', 'IN_PROGRESS'] },
            },
        });
        const vacantUnits = await this.prisma.unit.count({
            where: {
                property: { ownerId: userId },
                status: 'VACANT',
            },
        });
        return {
            totalProperties: properties,
            totalUnits: units,
            totalTenants: tenants,
            totalRevenue: payments._sum.amount || 0,
            pendingMaintenance: maintenanceRequests,
            vacantUnits,
            occupancyRate: units > 0 ? ((units - vacantUnits) / units) * 100 : 0,
        };
    }
    async getFinancial(userId, startDate, endDate) {
        const dateFilter = this.buildDateFilter(startDate, endDate);
        const payments = await this.prisma.payment.findMany({
            where: {
                lease: { unit: { property: { ownerId: userId } } },
                ...dateFilter,
            },
            include: {
                tenant: { include: { user: true } },
                lease: { include: { unit: { include: { property: true } } } },
            },
            orderBy: { dueDate: 'desc' },
        });
        const totalPaid = payments
            .filter((p) => p.status === 'PAID')
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const totalPending = payments
            .filter((p) => p.status === 'PENDING')
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const totalOverdue = payments
            .filter((p) => p.status === 'OVERDUE')
            .reduce((sum, p) => sum + Number(p.amount), 0);
        return {
            totalPaid,
            totalPending,
            totalOverdue,
            totalExpected: totalPaid + totalPending + totalOverdue,
            payments: payments.map((p) => ({
                id: p.id,
                tenant: p.tenant.user.fullName,
                property: p.lease.unit.property.name,
                unit: p.lease.unit.unitNumber,
                amount: Number(p.amount),
                dueDate: p.dueDate,
                paidDate: p.paidDate,
                status: p.status,
                method: p.method,
            })),
        };
    }
    async getProperty(userId) {
        const properties = await this.prisma.property.findMany({
            where: { ownerId: userId },
            include: {
                units: {
                    include: {
                        leases: {
                            where: { isActive: true },
                            include: { payments: true },
                        },
                    },
                },
            },
        });
        return properties.map((property) => {
            const totalUnits = property.units.length;
            const occupiedUnits = property.units.filter((u) => u.leases.length > 0).length;
            const vacantUnits = totalUnits - occupiedUnits;
            const totalRevenue = property.units.reduce((sum, unit) => {
                const unitRevenue = unit.leases.reduce((leaseSum, lease) => {
                    const paidPayments = lease.payments
                        .filter((p) => p.status === 'PAID')
                        .reduce((pSum, p) => pSum + Number(p.amount), 0);
                    return leaseSum + paidPayments;
                }, 0);
                return sum + unitRevenue;
            }, 0);
            return {
                id: property.id,
                name: property.name,
                address: property.address,
                totalUnits,
                occupiedUnits,
                vacantUnits,
                occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
                totalRevenue,
            };
        });
    }
    async getTenant(userId) {
        const tenants = await this.prisma.tenant.findMany({
            where: {
                leases: {
                    some: {
                        unit: { property: { ownerId: userId } },
                        isActive: true,
                    },
                },
            },
            include: {
                user: true,
                leases: {
                    where: { isActive: true },
                    include: {
                        unit: { include: { property: true } },
                        payments: true,
                    },
                },
            },
        });
        return tenants.map((tenant) => {
            const activeLease = tenant.leases[0];
            const totalPaid = activeLease.payments
                .filter((p) => p.status === 'PAID')
                .reduce((sum, p) => sum + Number(p.amount), 0);
            const totalDue = activeLease.payments
                .filter((p) => p.status === 'PENDING' || p.status === 'OVERDUE')
                .reduce((sum, p) => sum + Number(p.amount), 0);
            return {
                id: tenant.id,
                name: tenant.user.fullName,
                email: tenant.user.email,
                phone: tenant.user.phone,
                property: activeLease.unit.property.name,
                unit: activeLease.unit.unitNumber,
                rentAmount: Number(activeLease.rentAmount),
                leaseStart: activeLease.startDate,
                leaseEnd: activeLease.endDate,
                totalPaid,
                totalDue,
                paymentStatus: totalDue > 0 ? 'Has Dues' : 'Up to Date',
            };
        });
    }
    async getMaintenance(userId, startDate, endDate) {
        const dateFilter = this.buildDateFilter(startDate, endDate, 'reportedAt');
        const requests = await this.prisma.maintenanceRequest.findMany({
            where: {
                unit: { property: { ownerId: userId } },
                ...dateFilter,
            },
            include: {
                unit: { include: { property: true } },
                tenant: { include: { user: true } },
            },
            orderBy: { reportedAt: 'desc' },
        });
        const byStatus = {
            PENDING: requests.filter((r) => r.status === 'PENDING').length,
            IN_PROGRESS: requests.filter((r) => r.status === 'IN_PROGRESS').length,
            COMPLETED: requests.filter((r) => r.status === 'COMPLETED').length,
            CANCELLED: requests.filter((r) => r.status === 'CANCELLED').length,
        };
        const byPriority = {
            LOW: requests.filter((r) => r.priority === 'LOW').length,
            MEDIUM: requests.filter((r) => r.priority === 'MEDIUM').length,
            HIGH: requests.filter((r) => r.priority === 'HIGH').length,
            URGENT: requests.filter((r) => r.priority === 'URGENT').length,
        };
        return {
            total: requests.length,
            byStatus,
            byPriority,
            requests: requests.map((r) => ({
                id: r.id,
                title: r.title,
                description: r.description,
                property: r.unit.property.name,
                unit: r.unit.unitNumber,
                tenant: r.tenant.user.fullName,
                priority: r.priority,
                status: r.status,
                reportedAt: r.reportedAt,
                resolvedAt: r.resolvedAt,
            })),
        };
    }
    async getVacancy(userId) {
        const units = await this.prisma.unit.findMany({
            where: {
                property: { ownerId: userId },
                status: 'VACANT',
            },
            include: {
                property: true,
                vacantListing: true,
            },
        });
        return units.map((unit) => ({
            id: unit.id,
            property: unit.property.name,
            unitNumber: unit.unitNumber,
            rentAmount: Number(unit.rentAmount),
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            hasListing: !!unit.vacantListing,
            listingViews: unit.vacantListing?.viewCount || 0,
            listingActive: unit.vacantListing?.isActive || false,
        }));
    }
    buildDateFilter(startDate, endDate, field = 'createdAt') {
        const filter = {};
        if (startDate || endDate) {
            filter[field] = {};
            if (startDate)
                filter[field].gte = new Date(startDate);
            if (endDate)
                filter[field].lte = new Date(endDate);
        }
        return filter;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map