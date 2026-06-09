import { SubscriptionsService } from './subscriptions.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
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
}
