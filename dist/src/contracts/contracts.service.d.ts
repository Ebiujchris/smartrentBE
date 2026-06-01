import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
export declare class ContractsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(landlordId: string, createContractDto: CreateContractDto): Promise<{
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
        landlord: {
            email: string;
            fullName: string;
            phone: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        address: string;
        unitNumber: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        tenantId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        content: string;
        propertyName: string;
        duration: number;
        terms: string[];
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        landlordId: string;
    }>;
    findAll(userId: string, userRole: string): Promise<({
        tenant: {
            user: {
                email: string;
                fullName: string;
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
        landlord: {
            email: string;
            fullName: string;
            phone: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        address: string;
        unitNumber: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        tenantId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        content: string;
        propertyName: string;
        duration: number;
        terms: string[];
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        landlordId: string;
    })[]>;
    findOne(id: string, userId: string, userRole: string): Promise<{
        tenant: {
            user: {
                email: string;
                fullName: string;
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
        landlord: {
            email: string;
            fullName: string;
            phone: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        address: string;
        unitNumber: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        tenantId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        content: string;
        propertyName: string;
        duration: number;
        terms: string[];
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        landlordId: string;
    }>;
    update(id: string, userId: string, updateContractDto: UpdateContractDto): Promise<{
        tenant: {
            user: {
                email: string;
                fullName: string;
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
        landlord: {
            email: string;
            fullName: string;
            phone: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        address: string;
        unitNumber: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        tenantId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        content: string;
        propertyName: string;
        duration: number;
        terms: string[];
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        landlordId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        address: string;
        unitNumber: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        tenantId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        content: string;
        propertyName: string;
        duration: number;
        terms: string[];
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        landlordId: string;
    }>;
    sendContract(id: string, userId: string): Promise<{
        tenant: {
            user: {
                email: string;
                fullName: string;
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
        landlord: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        address: string;
        unitNumber: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        tenantId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        content: string;
        propertyName: string;
        duration: number;
        terms: string[];
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        landlordId: string;
    }>;
    acceptContract(id: string, userId: string): Promise<{
        tenant: {
            user: {
                email: string;
                fullName: string;
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
        landlord: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        address: string;
        unitNumber: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        tenantId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        content: string;
        propertyName: string;
        duration: number;
        terms: string[];
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        landlordId: string;
    }>;
    rejectContract(id: string, userId: string, reason: string): Promise<{
        tenant: {
            user: {
                email: string;
                fullName: string;
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
        landlord: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        address: string;
        unitNumber: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        tenantId: string;
        startDate: Date;
        endDate: Date;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        content: string;
        propertyName: string;
        duration: number;
        terms: string[];
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        landlordId: string;
    }>;
}
