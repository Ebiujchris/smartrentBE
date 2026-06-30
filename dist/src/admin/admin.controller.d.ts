import { AdminService } from './admin.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateSubscriptionDto } from './dto/admin-update-subscription.dto';
import { ReplyMessageDto } from './dto/reply-message.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            landlords: number;
            tenants: number;
        };
        properties: {
            total: number;
            units: number;
            occupied: number;
            vacant: number;
            occupancyRate: number;
        };
        subscriptions: {
            total: number;
            active: number;
            trial: number;
            expired: number;
        };
        payments: {
            total: number;
            totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
        };
        unreadMessages: number;
        recentUsers: {
            email: string;
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            isSuspended: boolean;
            createdAt: Date;
        }[];
        recentPayments: ({
            tenant: {
                user: {
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
            lease: {
                unit: {
                    property: {
                        name: string;
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
            method: import("@prisma/client").$Enums.PaymentMethod | null;
            reference: string | null;
            notes: string | null;
            paidDate: Date | null;
        })[];
    }>;
    getUserGrowthData(): Promise<{
        landlords: number;
        tenants: number;
        total: number;
        month: string;
    }[]>;
    getUsers(page?: string, limit?: string, search?: string, role?: string, status?: string): Promise<{
        users: {
            subscription: {
                plan: import("@prisma/client").$Enums.SubscriptionPlan;
                status: import("@prisma/client").$Enums.SubscriptionStatus;
                maxUnits: number;
                trialEndsAt: Date | null;
                currentPeriodEnd: Date;
                amount: import("@prisma/client-runtime-utils").Decimal;
            } | null;
            email: string;
            fullName: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            isSuspended: boolean;
            createdAt: Date;
            updatedAt: Date;
            _count: {
                properties: number;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUserById(id: string): Promise<{
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            plan: import("@prisma/client").$Enums.SubscriptionPlan;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            maxUnits: number;
            trialEndsAt: Date | null;
            currentPeriodStart: Date;
            currentPeriodEnd: Date;
            amount: import("@prisma/client-runtime-utils").Decimal;
            userId: string;
        } | null;
        email: string;
        fullName: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        isSuspended: boolean;
        createdAt: Date;
        updatedAt: Date;
        properties: ({
            units: {
                id: string;
                status: import("@prisma/client").$Enums.UnitStatus;
                unitNumber: string;
                rentAmount: import("@prisma/client-runtime-utils").Decimal;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string;
            description: string | null;
            ownerId: string;
        })[];
        tenantProfile: ({
            leases: ({
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
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            nationalId: string | null;
            emergencyContact: string | null;
            occupation: string | null;
        }) | null;
        _count: {
            properties: number;
            notifications: number;
        };
    }>;
    updateUser(id: string, updateDto: UpdateUserDto): Promise<{
        email: string;
        fullName: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        isSuspended: boolean;
        updatedAt: Date;
    }>;
    suspendUser(id: string): Promise<{
        fullName: string;
        id: string;
        isSuspended: boolean;
    }>;
    unsuspendUser(id: string): Promise<{
        fullName: string;
        id: string;
        isSuspended: boolean;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getSubscriptions(page?: string, limit?: string, plan?: string, status?: string): Promise<{
        subscriptions: ({
            user: {
                email: string;
                fullName: string;
                phone: string | null;
                id: string;
                isSuspended: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            plan: import("@prisma/client").$Enums.SubscriptionPlan;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            maxUnits: number;
            trialEndsAt: Date | null;
            currentPeriodStart: Date;
            currentPeriodEnd: Date;
            amount: import("@prisma/client-runtime-utils").Decimal;
            userId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateSubscription(userId: string, dto: AdminUpdateSubscriptionDto): Promise<{
        user: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        plan: import("@prisma/client").$Enums.SubscriptionPlan;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        maxUnits: number;
        trialEndsAt: Date | null;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        userId: string;
    }>;
    getMessages(page?: string, limit?: string, unreadOnly?: string): Promise<{
        messages: ({
            _count: {
                replies: number;
            };
            sender: {
                email: string;
                fullName: string;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
            };
            replies: ({
                sender: {
                    fullName: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isRead: boolean;
                senderId: string;
                receiverId: string | null;
                subject: string | null;
                content: string;
                parentId: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isRead: boolean;
            senderId: string;
            receiverId: string | null;
            subject: string | null;
            content: string;
            parentId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    markMessageAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isRead: boolean;
        senderId: string;
        receiverId: string | null;
        subject: string | null;
        content: string;
        parentId: string | null;
    }>;
    replyToMessage(id: string, user: any, dto: ReplyMessageDto): Promise<{
        sender: {
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isRead: boolean;
        senderId: string;
        receiverId: string | null;
        subject: string | null;
        content: string;
        parentId: string | null;
    }>;
    getProperties(page?: string, limit?: string, search?: string): Promise<{
        properties: {
            totalUnits: number;
            occupiedUnits: number;
            vacantUnits: number;
            owner: {
                email: string;
                fullName: string;
                id: string;
            };
            units: {
                id: string;
                status: import("@prisma/client").$Enums.UnitStatus;
                unitNumber: string;
                rentAmount: import("@prisma/client-runtime-utils").Decimal;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string;
            description: string | null;
            ownerId: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPayments(page?: string, limit?: string, status?: string): Promise<{
        payments: ({
            tenant: {
                user: {
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
            lease: {
                unit: {
                    property: {
                        name: string;
                        address: string;
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
            method: import("@prisma/client").$Enums.PaymentMethod | null;
            reference: string | null;
            notes: string | null;
            paidDate: Date | null;
        })[];
        totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getActivityLog(limit?: string): Promise<({
        type: "registration";
        description: string;
        timestamp: Date;
        id: string;
    } | {
        type: "payment";
        description: string;
        timestamp: Date;
        id: string;
    } | {
        type: "maintenance";
        description: string;
        timestamp: Date;
        id: string;
    })[]>;
}
