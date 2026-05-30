import { PrismaService } from '../prisma/prisma.service';
import { UpdateUnitDto } from './dto/update-unit.dto';
export declare class UnitsService {
    private prisma;
    constructor(prisma: PrismaService);
    update(unitId: string, userId: string, data: UpdateUnitDto): Promise<{
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
