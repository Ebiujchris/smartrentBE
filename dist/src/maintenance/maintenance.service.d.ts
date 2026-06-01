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
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string;
                ownerId: string;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.UnitStatus;
            createdAt: Date;
            updatedAt: Date;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
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
        title: string;
        description: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        reportedAt: Date;
        resolvedAt: Date | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        unitId: string;
        tenantId: string;
    }>;
    findAll(userId: string, user: any): Promise<({
        unit: {
            property: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string;
                ownerId: string;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.UnitStatus;
            createdAt: Date;
            updatedAt: Date;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
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
        title: string;
        description: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        reportedAt: Date;
        resolvedAt: Date | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        unitId: string;
        tenantId: string;
    })[]>;
    findOne(id: string, user: any): Promise<{
        unit: {
            property: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string;
                ownerId: string;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.UnitStatus;
            createdAt: Date;
            updatedAt: Date;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
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
        title: string;
        description: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        reportedAt: Date;
        resolvedAt: Date | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        unitId: string;
        tenantId: string;
    }>;
    update(id: string, updateMaintenanceDto: UpdateMaintenanceDto): Promise<{
        unit: {
            property: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string;
                ownerId: string;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.UnitStatus;
            createdAt: Date;
            updatedAt: Date;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
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
        title: string;
        description: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        reportedAt: Date;
        resolvedAt: Date | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        unitId: string;
        tenantId: string;
    }>;
    updateStatus(id: string, status: string, notes?: string): Promise<{
        unit: {
            property: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string;
                ownerId: string;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.UnitStatus;
            createdAt: Date;
            updatedAt: Date;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
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
        title: string;
        description: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        reportedAt: Date;
        resolvedAt: Date | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        unitId: string;
        tenantId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
