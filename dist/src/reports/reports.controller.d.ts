import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getOverview(user: any): Promise<{
        totalProperties: number;
        totalUnits: number;
        totalTenants: number;
        totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
        pendingMaintenance: number;
        vacantUnits: number;
        occupancyRate: number;
    }>;
    getFinancial(user: any, startDate?: string, endDate?: string): Promise<{
        totalPaid: number;
        totalPending: number;
        totalOverdue: number;
        totalExpected: number;
        payments: {
            id: string;
            tenant: string;
            property: string;
            unit: string;
            amount: number;
            dueDate: Date;
            paidDate: Date | null;
            status: import("@prisma/client").$Enums.PaymentStatus;
            method: import("@prisma/client").$Enums.PaymentMethod | null;
        }[];
    }>;
    getProperty(user: any): Promise<{
        id: string;
        name: string;
        address: string;
        totalUnits: number;
        occupiedUnits: number;
        vacantUnits: number;
        occupancyRate: number;
        totalRevenue: number;
    }[]>;
    getTenant(user: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        property: string;
        unit: string;
        rentAmount: number;
        leaseStart: Date;
        leaseEnd: Date;
        totalPaid: number;
        totalDue: number;
        paymentStatus: string;
    }[]>;
    getMaintenance(user: any, startDate?: string, endDate?: string): Promise<{
        total: number;
        byStatus: {
            PENDING: number;
            IN_PROGRESS: number;
            COMPLETED: number;
            CANCELLED: number;
        };
        byPriority: {
            LOW: number;
            MEDIUM: number;
            HIGH: number;
            URGENT: number;
        };
        requests: {
            id: string;
            title: string;
            description: string;
            property: string;
            unit: string;
            tenant: string;
            priority: import("@prisma/client").$Enums.MaintenancePriority;
            status: import("@prisma/client").$Enums.MaintenanceStatus;
            reportedAt: Date;
            resolvedAt: Date | null;
        }[];
    }>;
    getVacancy(user: any): Promise<{
        id: string;
        property: string;
        unitNumber: string;
        rentAmount: number;
        bedrooms: number | null;
        bathrooms: number | null;
        hasListing: boolean;
        listingViews: number;
        listingActive: boolean;
    }[]>;
}
