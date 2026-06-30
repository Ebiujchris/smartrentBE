import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
export declare class AdminUpdateSubscriptionDto {
    plan?: SubscriptionPlan;
    status?: SubscriptionStatus;
    maxUnits?: number;
    amount?: number;
    trialEndsAt?: string;
    currentPeriodEnd?: string;
}
