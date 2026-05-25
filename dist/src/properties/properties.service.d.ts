import { PrismaService } from '../prisma/prisma.service';
export declare class PropertiesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<({
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
    findOne(id: string, userId: string): Promise<{
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
    create(data: any, userId: string): Promise<{
        id: string;
        name: string;
        address: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any, userId: string): Promise<{
        id: string;
        name: string;
        address: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    getUnits(propertyId: string, userId: string): Promise<({
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
    createUnit(propertyId: string, data: any, userId: string): Promise<{
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
