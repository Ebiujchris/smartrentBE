import { PrismaService } from '../prisma/prisma.service';
export declare class ContactPurchasesService {
    private prisma;
    constructor(prisma: PrismaService);
    hasPurchased(listingId: string, buyerPhone: string): Promise<boolean>;
    createPurchase(data: {
        listingId: string;
        buyerPhone: string;
        buyerEmail?: string;
        buyerName?: string;
        paymentMethod: string;
        transactionId: string;
    }): Promise<{
        id: string;
        listingId: string;
        buyerPhone: string;
        buyerEmail: string | null;
        buyerName: string | null;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: string;
        transactionId: string | null;
        purchasedAt: Date;
        expiresAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    getContactInfo(listingId: string, buyerPhone: string): Promise<{
        contactName: string;
        contactPhone: string;
        contactEmail: string | null;
    } | null>;
    getAllPurchases(): Promise<({
        listing: {
            unit: {
                property: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    address: string;
                    description: string | null;
                    ownerId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.UnitStatus;
                unitNumber: string;
                floor: string | null;
                bedrooms: number | null;
                bathrooms: number | null;
                size: string | null;
                rentAmount: import("@prisma/client-runtime-utils").Decimal;
                propertyId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            isActive: boolean;
            unitId: string;
            title: string;
            highlights: string[];
            contactName: string;
            contactPhone: string;
            contactEmail: string | null;
            images: string[];
            availableFrom: Date;
            viewCount: number;
        };
    } & {
        id: string;
        listingId: string;
        buyerPhone: string;
        buyerEmail: string | null;
        buyerName: string | null;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: string;
        transactionId: string | null;
        purchasedAt: Date;
        expiresAt: Date | null;
        lastAccessedAt: Date | null;
    })[]>;
}
