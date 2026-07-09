import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, emailService: EmailService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
            subscription: any;
            tenantProfile: any;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<{
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
        email: string;
        fullName: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        createdAt: Date;
        tenantProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            nationalId: string | null;
            emergencyContact: string | null;
            occupation: string | null;
        } | null;
    } | null>;
    private generateToken;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
