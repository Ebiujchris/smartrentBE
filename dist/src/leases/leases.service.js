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
exports.LeasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LeasesService = class LeasesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createLeaseDto) {
        const { tenantId, unitId, startDate, endDate, rentAmount, deposit } = createLeaseDto;
        const unit = await this.prisma.unit.findUnique({
            where: { id: unitId },
        });
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        if (unit.status === 'OCCUPIED') {
            throw new common_1.BadRequestException('Unit is already occupied');
        }
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const lease = await this.prisma.$transaction(async (tx) => {
            const createdLease = await tx.lease.create({
                data: {
                    tenantId,
                    unitId,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    rentAmount,
                    deposit,
                    isActive: true,
                },
                include: {
                    tenant: {
                        include: {
                            user: true,
                        },
                    },
                    unit: {
                        include: {
                            property: true,
                        },
                    },
                },
            });
            await tx.unit.update({
                where: { id: unitId },
                data: { status: 'OCCUPIED' },
            });
            return createdLease;
        });
        return lease;
    }
    async findAll(userId) {
        const leases = await this.prisma.lease.findMany({
            include: {
                tenant: {
                    include: {
                        user: true,
                    },
                },
                unit: {
                    include: {
                        property: true,
                    },
                },
                payments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return leases;
    }
    async findOne(id) {
        const lease = await this.prisma.lease.findUnique({
            where: { id },
            include: {
                tenant: {
                    include: {
                        user: true,
                    },
                },
                unit: {
                    include: {
                        property: true,
                    },
                },
                payments: {
                    orderBy: {
                        dueDate: 'desc',
                    },
                },
            },
        });
        if (!lease) {
            throw new common_1.NotFoundException('Lease not found');
        }
        return lease;
    }
    async update(id, updateLeaseDto) {
        const lease = await this.prisma.lease.findUnique({
            where: { id },
        });
        if (!lease) {
            throw new common_1.NotFoundException('Lease not found');
        }
        const updated = await this.prisma.lease.update({
            where: { id },
            data: {
                ...updateLeaseDto,
                startDate: updateLeaseDto.startDate
                    ? new Date(updateLeaseDto.startDate)
                    : undefined,
                endDate: updateLeaseDto.endDate
                    ? new Date(updateLeaseDto.endDate)
                    : undefined,
            },
            include: {
                tenant: {
                    include: {
                        user: true,
                    },
                },
                unit: {
                    include: {
                        property: true,
                    },
                },
            },
        });
        return updated;
    }
    async terminate(id) {
        const lease = await this.prisma.lease.findUnique({
            where: { id },
        });
        if (!lease) {
            throw new common_1.NotFoundException('Lease not found');
        }
        const updated = await this.prisma.lease.update({
            where: { id },
            data: { isActive: false },
        });
        await this.prisma.unit.update({
            where: { id: lease.unitId },
            data: { status: 'VACANT' },
        });
        return updated;
    }
    async remove(id) {
        const lease = await this.prisma.lease.findUnique({
            where: { id },
        });
        if (!lease) {
            throw new common_1.NotFoundException('Lease not found');
        }
        await this.prisma.lease.delete({
            where: { id },
        });
        return { message: 'Lease deleted successfully' };
    }
};
exports.LeasesService = LeasesService;
exports.LeasesService = LeasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeasesService);
//# sourceMappingURL=leases.service.js.map