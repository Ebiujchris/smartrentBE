import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: any): Promise<{
        subscription: {
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
        } | null;
        tenantProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            nationalId: string | null;
            emergencyContact: string | null;
            occupation: string | null;
        } | null;
    } & {
        email: string;
        password: string;
        fullName: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        isSuspended: boolean;
        passwordResetToken: string | null;
        passwordResetExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
