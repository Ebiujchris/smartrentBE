import { PrismaService } from '../prisma/prisma.service';
export declare class PropertiesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
        units: {
            rentAmount: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.UnitStatus;
            unitNumber: string;
            floor: string | null;
            bedrooms: number | null;
            bathrooms: number | null;
            size: string | null;
            propertyId: string;
        }[];
        _count: {
            units: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string;
        description: string | null;
        ownerId: string;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        units: {
            rentAmount: number;
            leases: {
                rentAmount: number;
                deposit: number;
                tenant: {
                    user: {
                        email: string;
                        fullName: string;
                        phone: string | null;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                tenantId: string;
                unitId: string;
                startDate: Date;
                endDate: Date;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.UnitStatus;
            unitNumber: string;
            floor: string | null;
            bedrooms: number | null;
            bathrooms: number | null;
            size: string | null;
            propertyId: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string;
        description: string | null;
        ownerId: string;
    }>;
    create(data: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string;
        description: string | null;
        ownerId: string;
    }>;
    update(id: string, data: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string;
        description: string | null;
        ownerId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    getUnits(propertyId: string, userId: string): Promise<{
        rentAmount: number;
        leases: {
            rentAmount: number;
            deposit: number;
            tenant: {
                user: {
                    email: string;
                    fullName: string;
                    phone: string | null;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            tenantId: string;
            unitId: string;
            startDate: Date;
            endDate: Date;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.UnitStatus;
        unitNumber: string;
        floor: string | null;
        bedrooms: number | null;
        bathrooms: number | null;
        size: string | null;
        propertyId: string;
    }[]>;
    createUnit(propertyId: string, data: any, userId: string): Promise<{
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
    }>;
    getUnitById(unitId: string, userId: string): Promise<{
        property: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string;
            description: string | null;
            ownerId: string;
        };
        leases: ({
            tenant: {
                user: {
                    email: string;
                    fullName: string;
                    phone: string | null;
                    id: string;
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
    }>;
}
