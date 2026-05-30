import { UnitStatus } from '@prisma/client';
export declare class UpdateUnitDto {
    unitNumber?: string;
    floor?: string;
    bedrooms?: number;
    bathrooms?: number;
    size?: string;
    rentAmount?: number;
    status?: UnitStatus;
}
