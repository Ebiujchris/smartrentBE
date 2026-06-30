import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
export declare class MaintenanceService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, user: any, createMaintenanceDto: CreateMaintenanceDto): Promise<{
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
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                isSuspended: boolean;
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
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        description: string;
        tenantId: string;
        unitId: string;
        reportedAt: Date;
        notes: string | null;
        title: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        resolvedAt: Date | null;
    }>;
    findAll(userId: string, user: any): Promise<({
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
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                isSuspended: boolean;
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
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        description: string;
        tenantId: string;
        unitId: string;
        reportedAt: Date;
        notes: string | null;
        title: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        resolvedAt: Date | null;
    })[]>;
    findOne(id: string, user: any): Promise<{
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
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                isSuspended: boolean;
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
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        description: string;
        tenantId: string;
        unitId: string;
        reportedAt: Date;
        notes: string | null;
        title: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        resolvedAt: Date | null;
    }>;
    update(id: string, updateMaintenanceDto: UpdateMaintenanceDto, user: any): Promise<{
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
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                isSuspended: boolean;
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
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        description: string;
        tenantId: string;
        unitId: string;
        reportedAt: Date;
        notes: string | null;
        title: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        resolvedAt: Date | null;
    }>;
    updateStatus(id: string, status: string, notes?: string, user?: any): Promise<{
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
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                isSuspended: boolean;
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
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        description: string;
        tenantId: string;
        unitId: string;
        reportedAt: Date;
        notes: string | null;
        title: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        resolvedAt: Date | null;
    }>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
