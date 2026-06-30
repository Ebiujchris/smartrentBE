import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(user: any, createTenantDto: CreateTenantDto): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(user: any): Promise<any>;
    getCurrentTenant(user: any): Promise<{
        user: {
            email: string;
            fullName: string;
            phone: string | null;
            id: string;
            createdAt: Date;
        };
        leases: ({
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
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.PaymentStatus;
                amount: import("@prisma/client-runtime-utils").Decimal;
                tenantId: string;
                dueDate: Date;
                leaseId: string;
                method: import("@prisma/client").$Enums.PaymentMethod | null;
                reference: string | null;
                notes: string | null;
                paidDate: Date | null;
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
        })[];
        maintenanceRequests: {
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
        }[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
            tenantId: string;
            dueDate: Date;
            leaseId: string;
            method: import("@prisma/client").$Enums.PaymentMethod | null;
            reference: string | null;
            notes: string | null;
            paidDate: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        nationalId: string | null;
        emergencyContact: string | null;
        occupation: string | null;
    }>;
    findOne(id: string, user: any): Promise<{
        user: {
            email: string;
            fullName: string;
            phone: string | null;
            id: string;
            createdAt: Date;
        };
        leases: ({
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
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.PaymentStatus;
                amount: import("@prisma/client-runtime-utils").Decimal;
                tenantId: string;
                dueDate: Date;
                leaseId: string;
                method: import("@prisma/client").$Enums.PaymentMethod | null;
                reference: string | null;
                notes: string | null;
                paidDate: Date | null;
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
        })[];
        maintenanceRequests: {
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
        }[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
            tenantId: string;
            dueDate: Date;
            leaseId: string;
            method: import("@prisma/client").$Enums.PaymentMethod | null;
            reference: string | null;
            notes: string | null;
            paidDate: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        nationalId: string | null;
        emergencyContact: string | null;
        occupation: string | null;
    }>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeByUserId(userId: string): Promise<{
        message: string;
    }>;
}
