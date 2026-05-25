import { PropertiesService } from './properties.service';
export declare class PropertiesController {
    private propertiesService;
    constructor(propertiesService: PropertiesService);
    findAll(user: any): Promise<({
        units: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            unitNumber: string;
            floor: string | null;
            bedrooms: number | null;
            bathrooms: number | null;
            size: string | null;
            rentAmount: import("@prisma/client-runtime-utils").Decimal;
            status: import("@prisma/client").$Enums.UnitStatus;
            propertyId: string;
        }[];
        _count: {
            units: number;
        };
    } & {
        id: string;
        name: string;
        address: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string, user: any): Promise<{
        units: ({
            leases: ({
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
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            unitNumber: string;
            floor: string | null;
            bedrooms: number | null;
            bathrooms: number | null;
            size: string | null;
            rentAmount: import("@prisma/client-runtime-utils").Decimal;
            status: import("@prisma/client").$Enums.UnitStatus;
            propertyId: string;
        })[];
    } & {
        id: string;
        name: string;
        address: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: any, user: any): Promise<{
        id: string;
        name: string;
        address: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any, user: any): Promise<{
        id: string;
        name: string;
        address: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    getUnits(id: string, user: any): Promise<({
        leases: ({
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unitNumber: string;
        floor: string | null;
        bedrooms: number | null;
        bathrooms: number | null;
        size: string | null;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.UnitStatus;
        propertyId: string;
    })[]>;
    createUnit(id: string, data: any, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unitNumber: string;
        floor: string | null;
        bedrooms: number | null;
        bathrooms: number | null;
        size: string | null;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.UnitStatus;
        propertyId: string;
    }>;
}
