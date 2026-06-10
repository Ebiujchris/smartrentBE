import { ContactPurchasesService } from './contact-purchases.service';
import { PesapalService } from '../payments/pesapal.service';
export declare class ContactPurchasesController {
    private readonly service;
    private readonly pesapalService;
    constructor(service: ContactPurchasesService, pesapalService: PesapalService);
    checkPurchase(dto: {
        listingId: string;
        buyerPhone: string;
    }): Promise<{
        hasPurchased: boolean;
    }>;
    initiatePayment(dto: {
        listingId: string;
        buyerPhone: string;
        buyerEmail?: string;
        buyerName?: string;
    }): Promise<{
        success: boolean;
        message: string;
    } | {
        txRef: string;
        success: boolean;
        redirectUrl?: string;
        message: string;
        status: "pending" | "successful" | "failed";
    }>;
    verifyAndPurchase(dto: {
        orderTrackingId: string;
        listingId: string;
        buyerPhone: string;
        buyerEmail?: string;
        buyerName?: string;
    }): Promise<{
        success: boolean;
        message: string;
        status: "pending" | "successful" | "failed";
        contact?: undefined;
        purchase?: undefined;
    } | {
        success: boolean;
        message: string;
        contact: {
            contactName: string;
            contactPhone: string;
            contactEmail: string | null;
        } | null;
        purchase: {
            id: string;
            paymentMethod: string;
            listingId: string;
            buyerPhone: string;
            buyerEmail: string | null;
            buyerName: string | null;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string | null;
            purchasedAt: Date;
            expiresAt: Date | null;
            lastAccessedAt: Date | null;
        };
        status?: undefined;
    }>;
    createPurchase(dto: {
        listingId: string;
        buyerPhone: string;
        buyerEmail?: string;
        buyerName?: string;
        paymentMethod: string;
        transactionId: string;
    }): Promise<{
        id: string;
        paymentMethod: string;
        listingId: string;
        buyerPhone: string;
        buyerEmail: string | null;
        buyerName: string | null;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        purchasedAt: Date;
        expiresAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    getContact(listingId: string, buyerPhone: string): Promise<{
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
        paymentMethod: string;
        listingId: string;
        buyerPhone: string;
        buyerEmail: string | null;
        buyerName: string | null;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        purchasedAt: Date;
        expiresAt: Date | null;
        lastAccessedAt: Date | null;
    })[]>;
}
