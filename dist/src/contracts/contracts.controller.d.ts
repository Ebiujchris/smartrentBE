import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    create(user: any, createContractDto: CreateContractDto): Promise<{
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
    findAll(user: any): Promise<({
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
    findOne(id: string, user: any): Promise<{
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
    update(id: string, user: any, updateContractDto: UpdateContractDto): Promise<{
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
    remove(id: string, user: any): Promise<{
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
    sendContract(id: string, user: any): Promise<{
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
    acceptContract(id: string, user: any): Promise<{
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
    rejectContract(id: string, user: any, reason: string): Promise<{
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
