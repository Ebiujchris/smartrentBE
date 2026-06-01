import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
export declare class ContractsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(landlordId: string, createContractDto: CreateContractDto): Promise<{
        landlord: {
            id: string;
            email: string;
            fullName: string;
            phone: string | null;
        };
        tenant: {
            user: {
                id: string;
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
        title: string;
        content: string;
        propertyName: string;
        unitNumber: string;
        address: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        endDate: Date;
        duration: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        terms: string[];
        createdAt: Date;
        updatedAt: Date;
        landlordId: string;
        tenantId: string;
    }>;
    findAll(userId: string, userRole: string): Promise<({
        landlord: {
            id: string;
            email: string;
            fullName: string;
            phone: string | null;
        };
        tenant: {
            user: {
                id: string;
                email: string;
                fullName: string;
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
        content: string;
        propertyName: string;
        unitNumber: string;
        address: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        endDate: Date;
        duration: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        terms: string[];
        createdAt: Date;
        updatedAt: Date;
        landlordId: string;
        tenantId: string;
    })[]>;
    findOne(id: string, userId: string, userRole: string): Promise<{
        landlord: {
            id: string;
            email: string;
            fullName: string;
            phone: string | null;
        };
        tenant: {
            user: {
                id: string;
                email: string;
                fullName: string;
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
        content: string;
        propertyName: string;
        unitNumber: string;
        address: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        endDate: Date;
        duration: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        terms: string[];
        createdAt: Date;
        updatedAt: Date;
        landlordId: string;
        tenantId: string;
    }>;
    update(id: string, userId: string, updateContractDto: UpdateContractDto): Promise<{
        landlord: {
            id: string;
            email: string;
            fullName: string;
            phone: string | null;
        };
        tenant: {
            user: {
                id: string;
                email: string;
                fullName: string;
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
        content: string;
        propertyName: string;
        unitNumber: string;
        address: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        endDate: Date;
        duration: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        terms: string[];
        createdAt: Date;
        updatedAt: Date;
        landlordId: string;
        tenantId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        title: string;
        content: string;
        propertyName: string;
        unitNumber: string;
        address: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        endDate: Date;
        duration: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        terms: string[];
        createdAt: Date;
        updatedAt: Date;
        landlordId: string;
        tenantId: string;
    }>;
    sendContract(id: string, userId: string): Promise<{
        landlord: {
            id: string;
            email: string;
            fullName: string;
        };
        tenant: {
            user: {
                id: string;
                email: string;
                fullName: string;
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
        content: string;
        propertyName: string;
        unitNumber: string;
        address: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        endDate: Date;
        duration: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        terms: string[];
        createdAt: Date;
        updatedAt: Date;
        landlordId: string;
        tenantId: string;
    }>;
    acceptContract(id: string, userId: string): Promise<{
        landlord: {
            id: string;
            email: string;
            fullName: string;
        };
        tenant: {
            user: {
                id: string;
                email: string;
                fullName: string;
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
        content: string;
        propertyName: string;
        unitNumber: string;
        address: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        endDate: Date;
        duration: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        terms: string[];
        createdAt: Date;
        updatedAt: Date;
        landlordId: string;
        tenantId: string;
    }>;
    rejectContract(id: string, userId: string, reason: string): Promise<{
        landlord: {
            id: string;
            email: string;
            fullName: string;
        };
        tenant: {
            user: {
                id: string;
                email: string;
                fullName: string;
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
        content: string;
        propertyName: string;
        unitNumber: string;
        address: string;
        rentAmount: import("@prisma/client-runtime-utils").Decimal;
        deposit: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        endDate: Date;
        duration: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        sentAt: Date | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        terms: string[];
        createdAt: Date;
        updatedAt: Date;
        landlordId: string;
        tenantId: string;
    }>;
}
