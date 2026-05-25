import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(user: any, createPaymentDto: CreatePaymentDto): Promise<{
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
        lease: {
            unit: {
                property: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
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
            rentAmount: import("@prisma/client-runtime-utils").Decimal;
            isActive: boolean;
            tenantId: string;
            unitId: string;
            startDate: Date;
            endDate: Date;
            deposit: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
        tenantId: string;
        leaseId: string;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
        paidDate: Date | null;
    }>;
    findAll(user: any): Promise<({
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
        lease: {
            unit: {
                property: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
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
            rentAmount: import("@prisma/client-runtime-utils").Decimal;
            isActive: boolean;
            tenantId: string;
            unitId: string;
            startDate: Date;
            endDate: Date;
            deposit: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
        tenantId: string;
        leaseId: string;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
        paidDate: Date | null;
    })[]>;
    getOverdue(user: any): Promise<({
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
        lease: {
            unit: {
                property: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
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
            rentAmount: import("@prisma/client-runtime-utils").Decimal;
            isActive: boolean;
            tenantId: string;
            unitId: string;
            startDate: Date;
            endDate: Date;
            deposit: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
        tenantId: string;
        leaseId: string;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
        paidDate: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
        lease: {
            unit: {
                property: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
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
            rentAmount: import("@prisma/client-runtime-utils").Decimal;
            isActive: boolean;
            tenantId: string;
            unitId: string;
            startDate: Date;
            endDate: Date;
            deposit: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
        tenantId: string;
        leaseId: string;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
        paidDate: Date | null;
    }>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
        lease: {
            unit: {
                property: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
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
            rentAmount: import("@prisma/client-runtime-utils").Decimal;
            isActive: boolean;
            tenantId: string;
            unitId: string;
            startDate: Date;
            endDate: Date;
            deposit: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
        tenantId: string;
        leaseId: string;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
        paidDate: Date | null;
    }>;
    recordPayment(id: string, body: {
        method: string;
        reference?: string;
    }): Promise<{
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
        lease: {
            unit: {
                property: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
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
            rentAmount: import("@prisma/client-runtime-utils").Decimal;
            isActive: boolean;
            tenantId: string;
            unitId: string;
            startDate: Date;
            endDate: Date;
            deposit: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
        tenantId: string;
        leaseId: string;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
        paidDate: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
