import { PropertiesService } from './properties.service';
export declare class PropertiesController {
    private propertiesService;
    constructor(propertiesService: PropertiesService);
    findAll(user: any): Promise<{
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        description: string | null;
        ownerId: string;
    }[]>;
    findOne(id: string, user: any): Promise<{
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        description: string | null;
        ownerId: string;
    }>;
    create(data: any, user: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        description: string | null;
        ownerId: string;
    }>;
    update(id: string, data: any, user: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        description: string | null;
        ownerId: string;
    }>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    getUnits(id: string, user: any): Promise<{
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
    createUnit(id: string, data: any, user: any): Promise<{
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
    getUnit(unitId: string, user: any): Promise<{
        property: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
        })[];
        maintenanceRequests: {
            priority: import("@prisma/client").$Enums.MaintenancePriority;
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
