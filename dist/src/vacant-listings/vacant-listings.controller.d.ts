import { VacantListingsService } from './vacant-listings.service';
import { CreateVacantListingDto } from './dto/create-vacant-listing.dto';
import { UpdateVacantListingDto } from './dto/update-vacant-listing.dto';
export declare class VacantListingsController {
    private readonly vacantListingsService;
    constructor(vacantListingsService: VacantListingsService);
    create(user: any, createVacantListingDto: CreateVacantListingDto): Promise<{
        unit: {
            property: {
                owner: {
                    email: string;
                    fullName: string;
                    phone: string | null;
                    id: string;
                };
            } & {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        unitId: string;
        title: string;
        highlights: string[];
        contactName: string;
        contactPhone: string;
        contactEmail: string | null;
        images: string[];
        availableFrom: Date;
        viewCount: number;
    }>;
    findAllPublic(bedrooms?: number, minPrice?: number, maxPrice?: number, location?: string): Promise<({
        unit: {
            property: {
                name: string;
                id: string;
                address: string;
                description: string | null;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        unitId: string;
        title: string;
        highlights: string[];
        contactName: string;
        contactPhone: string;
        contactEmail: string | null;
        images: string[];
        availableFrom: Date;
        viewCount: number;
    })[]>;
    findMyListings(user: any): Promise<({
        unit: {
            property: {
                name: string;
                id: string;
                address: string;
                description: string | null;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        unitId: string;
        title: string;
        highlights: string[];
        contactName: string;
        contactPhone: string;
        contactEmail: string | null;
        images: string[];
        availableFrom: Date;
        viewCount: number;
    })[]>;
    findOne(id: string): Promise<{
        unit: {
            property: {
                owner: {
                    email: string;
                    fullName: string;
                    phone: string | null;
                    id: string;
                };
            } & {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        unitId: string;
        title: string;
        highlights: string[];
        contactName: string;
        contactPhone: string;
        contactEmail: string | null;
        images: string[];
        availableFrom: Date;
        viewCount: number;
    }>;
    update(id: string, user: any, updateVacantListingDto: UpdateVacantListingDto): Promise<{
        unit: {
            property: {
                owner: {
                    email: string;
                    fullName: string;
                    phone: string | null;
                    id: string;
                };
            } & {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        unitId: string;
        title: string;
        highlights: string[];
        contactName: string;
        contactPhone: string;
        contactEmail: string | null;
        images: string[];
        availableFrom: Date;
        viewCount: number;
    }>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    incrementViewCount(id: string): Promise<{
        unit: {
            property: {
                name: string;
                id: string;
                address: string;
                description: string | null;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        unitId: string;
        title: string;
        highlights: string[];
        contactName: string;
        contactPhone: string;
        contactEmail: string | null;
        images: string[];
        availableFrom: Date;
        viewCount: number;
    }>;
}
