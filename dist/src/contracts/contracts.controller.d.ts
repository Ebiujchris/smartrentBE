import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    create(user: any, createContractDto: CreateContractDto): Promise<{
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
    findAll(user: any): Promise<({
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
    findOne(id: string, user: any): Promise<{
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
    update(id: string, user: any, updateContractDto: UpdateContractDto): Promise<{
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
    remove(id: string, user: any): Promise<{
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
    sendContract(id: string, user: any): Promise<{
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
    acceptContract(id: string, user: any): Promise<{
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
    rejectContract(id: string, user: any, reason: string): Promise<{
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
