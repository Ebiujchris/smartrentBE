import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly prisma;
    private readonly configService;
    constructor(paymentsService: PaymentsService, prisma: PrismaService, configService: ConfigService);
    getDebugEnv(): {
        env: string | undefined;
        hasKey: boolean;
        hasSecret: boolean;
        nodeEnv: string | undefined;
    };
    create(user: any, createPaymentDto: CreatePaymentDto): Promise<{
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                isSuspended: boolean;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
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
        tenantId: string;
        dueDate: Date;
        leaseId: string;
        paidDate: Date | null;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
    }>;
    findAll(user: any): Promise<any>;
    getOverdue(user: any): Promise<({
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                isSuspended: boolean;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
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
        tenantId: string;
        dueDate: Date;
        leaseId: string;
        paidDate: Date | null;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
    })[]>;
    findByTenant(tenantId: string): Promise<({
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                isSuspended: boolean;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
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
        tenantId: string;
        dueDate: Date;
        leaseId: string;
        paidDate: Date | null;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
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
                isSuspended: boolean;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
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
        tenantId: string;
        dueDate: Date;
        leaseId: string;
        paidDate: Date | null;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
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
                isSuspended: boolean;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
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
        tenantId: string;
        dueDate: Date;
        leaseId: string;
        paidDate: Date | null;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
    }>;
    fixPaymentDates(): Promise<{
        message: string;
        count: number;
    }>;
    recordPayment(id: string, body: {
        method: string;
        reference?: string;
        notes?: string;
    }): Promise<{
        amount: number;
        lease: {
            rentAmount: number;
            deposit: number;
            unit: {
                property: {
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            tenantId: string;
            unitId: string;
            startDate: Date;
            endDate: Date;
        };
        tenant: {
            user: {
                email: string;
                password: string;
                fullName: string;
                phone: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                isSuspended: boolean;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        tenantId: string;
        dueDate: Date;
        leaseId: string;
        paidDate: Date | null;
        method: import("@prisma/client").$Enums.PaymentMethod | null;
        reference: string | null;
        notes: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
