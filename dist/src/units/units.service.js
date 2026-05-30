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
exports.UnitsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let UnitsService = class UnitsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async update(unitId, userId, data) {
        const unit = await this.prisma.unit.findUnique({
            where: { id: unitId },
            include: {
                property: true,
                leases: {
                    where: { isActive: true },
                    take: 1,
                },
            },
        });
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        if (unit.property.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (data.status === client_1.UnitStatus.VACANT && unit.leases.length > 0) {
            await this.prisma.lease.updateMany({
                where: {
                    unitId,
                    isActive: true,
                },
                data: {
                    isActive: false,
                },
            });
        }
        if (data.status === client_1.UnitStatus.OCCUPIED && unit.leases.length === 0) {
            throw new common_1.BadRequestException('Cannot mark unit as occupied without an active lease');
        }
        return this.prisma.unit.update({
            where: { id: unitId },
            data: {
                unitNumber: data.unitNumber,
                floor: data.floor,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                size: data.size,
                rentAmount: data.rentAmount,
                status: data.status,
            },
        });
    }
};
exports.UnitsService = UnitsService;
exports.UnitsService = UnitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UnitsService);
//# sourceMappingURL=units.service.js.map