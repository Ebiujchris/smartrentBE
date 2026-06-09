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
exports.ContactPurchasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContactPurchasesService = class ContactPurchasesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async hasPurchased(listingId, buyerPhone) {
        const purchase = await this.prisma.contactPurchase.findFirst({
            where: {
                listingId,
                buyerPhone,
            },
        });
        return !!purchase;
    }
    async createPurchase(data) {
        const listing = await this.prisma.vacantListing.findUnique({
            where: { id: data.listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const existing = await this.hasPurchased(data.listingId, data.buyerPhone);
        if (existing) {
            throw new common_1.BadRequestException('Contact already purchased for this listing');
        }
        const purchase = await this.prisma.contactPurchase.create({
            data: {
                listingId: data.listingId,
                buyerPhone: data.buyerPhone,
                buyerEmail: data.buyerEmail,
                buyerName: data.buyerName,
                paymentMethod: data.paymentMethod,
                transactionId: data.transactionId,
                amountPaid: 10000,
            },
        });
        return purchase;
    }
    async getContactInfo(listingId, buyerPhone) {
        const hasPurchased = await this.hasPurchased(listingId, buyerPhone);
        if (!hasPurchased) {
            throw new common_1.BadRequestException('Contact not purchased. Please purchase to view.');
        }
        const listing = await this.prisma.vacantListing.findUnique({
            where: { id: listingId },
            select: {
                contactName: true,
                contactPhone: true,
                contactEmail: true,
            },
        });
        await this.prisma.contactPurchase.updateMany({
            where: {
                listingId,
                buyerPhone,
            },
            data: {
                lastAccessedAt: new Date(),
            },
        });
        return listing;
    }
    async getAllPurchases() {
        return this.prisma.contactPurchase.findMany({
            include: {
                listing: {
                    include: {
                        unit: {
                            include: {
                                property: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                purchasedAt: 'desc',
            },
        });
    }
};
exports.ContactPurchasesService = ContactPurchasesService;
exports.ContactPurchasesService = ContactPurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactPurchasesService);
//# sourceMappingURL=contact-purchases.service.js.map