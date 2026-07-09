import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
export declare class LeasesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createLeaseDto: CreateLeaseDto): Promise<{
        unit: {
            property: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
        tenant: {
            user: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            nationalId: string | null;
            emergencyContact: string | null;
            occupation: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        isActive: boolean;
        tenantId: string;
        unitId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
    }>;
    findAll(userId: string): Promise<({
        unit: {
            property: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
        tenant: {
            user: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            nationalId: string | null;
            emergencyContact: string | null;
            occupation: string | null;
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
            tenantId: string;
            dueDate: Date;
            leaseId: string;
            paidDate: Date | null;
            method: import("@prisma/client").$Enums.PaymentMethod | null;
            reference: string | null;
            notes: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        isActive: boolean;
        tenantId: string;
        unitId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
    })[]>;
    findOne(id: string, user: any): Promise<{
        unit: {
            property: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
        tenant: {
            user: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            nationalId: string | null;
            emergencyContact: string | null;
            occupation: string | null;
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
            tenantId: string;
            dueDate: Date;
            leaseId: string;
            paidDate: Date | null;
            method: import("@prisma/client").$Enums.PaymentMethod | null;
            reference: string | null;
            notes: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        isActive: boolean;
        tenantId: string;
        unitId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
    }>;
    update(id: string, updateLeaseDto: UpdateLeaseDto, user: any): Promise<{
        unit: {
            property: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
        tenant: {
            user: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            nationalId: string | null;
            emergencyContact: string | null;
            occupation: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        isActive: boolean;
        tenantId: string;
        unitId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
    }>;
    terminate(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        isActive: boolean;
        tenantId: string;
        unitId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
    }>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
