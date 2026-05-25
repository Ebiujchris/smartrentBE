import { PrismaService } from '../prisma/prisma.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
export declare class SubscriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSubscription(userId: string): Promise<{
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
    updateSubscription(userId: string, updateDto: UpdateSubscriptionDto): Promise<{
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
    activateSubscription(userId: string): Promise<{
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
    checkTrialExpiry(userId: string): Promise<{
        expired: boolean;
        trialEndsAt?: undefined;
        daysRemaining?: undefined;
    } | {
        expired: boolean;
        trialEndsAt: Date;
        daysRemaining: number;
    }>;
}
