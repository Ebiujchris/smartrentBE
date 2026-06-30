import { SubscriptionsService } from './subscriptions.service';
import { PesapalService } from '../payments/pesapal.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    private readonly pesapalService;
    constructor(subscriptionsService: SubscriptionsService, pesapalService: PesapalService);
    getSubscription(user: any): Promise<{
        user: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        plan: import("@prisma/client").$Enums.SubscriptionPlan;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        maxUnits: number;
        trialEndsAt: Date | null;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        userId: string;
    }>;
    updateSubscription(user: any, updateDto: UpdateSubscriptionDto): Promise<{
        user: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        plan: import("@prisma/client").$Enums.SubscriptionPlan;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        maxUnits: number;
        trialEndsAt: Date | null;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        userId: string;
    }>;
    checkTrialExpiry(user: any): Promise<{
        expired: boolean;
        trialEndsAt?: undefined;
        daysRemaining?: undefined;
        isExpiringSoon?: undefined;
        currentPeriodEnd?: undefined;
    } | {
        expired: boolean;
        trialEndsAt: Date;
        daysRemaining: number;
        isExpiringSoon: boolean;
        currentPeriodEnd?: undefined;
    } | {
        expired: boolean;
        currentPeriodEnd: Date;
        daysRemaining: number;
        isExpiringSoon: boolean;
        trialEndsAt?: undefined;
    }>;
    initiatePayment(user: any, dto: {
        planId: string;
        amount: number;
        phoneNumber: string;
    }): Promise<{
        txRef: string;
        success: boolean;
        redirectUrl?: string;
        message: string;
        status: "pending" | "successful" | "failed";
    }>;
    verifyAndPurchase(user: any, dto: {
        orderTrackingId: string;
        planId: string;
        amount: number;
        phoneNumber: string;
    }): Promise<{
        success: boolean;
        message: string;
        status: "pending" | "successful" | "failed";
    } | {
        success: boolean;
        message: string;
        status?: undefined;
    }>;
}
