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
exports.VacantListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VacantListingsService = class VacantListingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscription: true,
            },
        });
        if (!user?.subscription) {
            throw new common_1.ForbiddenException('No active subscription found');
        }
        if (user.subscription.plan === 'STARTER') {
            throw new common_1.ForbiddenException('Vacancy advertising is only available on Professional and Premium plans. Please upgrade your subscription.');
        }
        const unit = await this.prisma.unit.findUnique({
            where: { id: createDto.unitId },
            include: {
                property: true,
            },
        });
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        if (unit.property.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not own this unit');
        }
        const existingListing = await this.prisma.vacantListing.findUnique({
            where: { unitId: createDto.unitId },
        });
        if (existingListing) {
            throw new common_1.BadRequestException('A listing already exists for this unit');
        }
        const listing = await this.prisma.vacantListing.create({
            data: {
                ...createDto,
                availableFrom: new Date(createDto.availableFrom),
            },
            include: {
                unit: {
                    include: {
                        property: {
                            include: {
                                owner: {
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
                },
            },
        });
        return listing;
    }
    async findAllPublic(filters) {
        const where = {
            isActive: true,
        };
        if (filters?.bedrooms) {
            where.unit = {
                ...where.unit,
                bedrooms: filters.bedrooms,
            };
        }
        if (filters?.minPrice || filters?.maxPrice) {
            where.unit = {
                ...where.unit,
                rentAmount: {
                    ...(filters.minPrice && { gte: filters.minPrice }),
                    ...(filters.maxPrice && { lte: filters.maxPrice }),
                },
            };
        }
        if (filters?.location) {
            where.unit = {
                ...where.unit,
                property: {
                    address: {
                        contains: filters.location,
                        mode: 'insensitive',
                    },
                },
            };
        }
        const listings = await this.prisma.vacantListing.findMany({
            where,
            include: {
                unit: {
                    include: {
                        property: {
                            select: {
                                id: true,
                                name: true,
                                address: true,
                                description: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return listings;
    }
    async findMyListings(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscription: true,
            },
        });
        if (!user?.subscription) {
            throw new common_1.ForbiddenException('No active subscription found');
        }
        if (user.subscription.plan === 'STARTER') {
            throw new common_1.ForbiddenException('Vacancy advertising is only available on Professional and Premium plans.');
        }
        const listings = await this.prisma.vacantListing.findMany({
            where: {
                unit: {
                    property: {
                        ownerId: userId,
                    },
                },
            },
            include: {
                unit: {
                    include: {
                        property: {
                            select: {
                                id: true,
                                name: true,
                                address: true,
                                description: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return listings;
    }
    async findOne(id) {
        const listing = await this.prisma.vacantListing.findUnique({
            where: { id },
            include: {
                unit: {
                    include: {
                        property: {
                            include: {
                                owner: {
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
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        return listing;
    }
    async update(id, userId, updateDto) {
        const listing = await this.prisma.vacantListing.findUnique({
            where: { id },
            include: {
                unit: {
                    include: {
                        property: true,
                    },
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.unit.property.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not own this listing');
        }
        if (updateDto.unitId && updateDto.unitId !== listing.unitId) {
            const newUnit = await this.prisma.unit.findUnique({
                where: { id: updateDto.unitId },
                include: { property: true },
            });
            if (!newUnit) {
                throw new common_1.NotFoundException('New unit not found');
            }
            if (newUnit.property.ownerId !== userId) {
                throw new common_1.ForbiddenException('You do not own the new unit');
            }
            const existingListing = await this.prisma.vacantListing.findUnique({
                where: { unitId: updateDto.unitId },
            });
            if (existingListing && existingListing.id !== id) {
                throw new common_1.BadRequestException('A listing already exists for this unit');
            }
        }
        const updatedListing = await this.prisma.vacantListing.update({
            where: { id },
            data: {
                ...updateDto,
                ...(updateDto.availableFrom && {
                    availableFrom: new Date(updateDto.availableFrom),
                }),
            },
            include: {
                unit: {
                    include: {
                        property: {
                            include: {
                                owner: {
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
                },
            },
        });
        return updatedListing;
    }
    async remove(id, userId) {
        const listing = await this.prisma.vacantListing.findUnique({
            where: { id },
            include: {
                unit: {
                    include: {
                        property: true,
                    },
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.unit.property.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not own this listing');
        }
        await this.prisma.vacantListing.delete({
            where: { id },
        });
        return { message: 'Listing deleted successfully' };
    }
    async incrementViewCount(id) {
        const listing = await this.prisma.vacantListing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const updatedListing = await this.prisma.vacantListing.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
            include: {
                unit: {
                    include: {
                        property: {
                            select: {
                                id: true,
                                name: true,
                                address: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        });
        return updatedListing;
    }
};
exports.VacantListingsService = VacantListingsService;
exports.VacantListingsService = VacantListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VacantListingsService);
//# sourceMappingURL=vacant-listings.service.js.map