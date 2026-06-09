import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getFinancialReport(landlordId: string, startDate?: Date, endDate?: Date) {
    const where: any = { landlordId };
    
    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate.gte = startDate;
      if (endDate) where.paymentDate.lte = endDate;
    }

    // Get all payments
    const payments = await this.prisma.payment.findMany({
      where,
      include: {
        tenant: { select: { firstName: true, lastName: true } },
        unit: { 
          select: { 
            unitNumber: true,
            property: { select: { name: true } }
          } 
        },
      },
      orderBy: { paymentDate: 'desc' },
    });

    // Calculate totals
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidCount = payments.filter(p => p.status === 'PAID').length;
    const pendingCount = payments.filter(p => p.status === 'PENDING').length;
    const lateCount = payments.filter(p => p.status === 'LATE').length;

    // Monthly breakdown
    const monthlyData: Record<string, number> = {};
    payments.forEach(payment => {
      const month = payment.paymentDate.toISOString().substring(0, 7); // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + payment.amount;
    });

    return {
      totalCollected,
      paidCount,
      pendingCount,
      lateCount,
      payments: payments.map(p => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        paymentDate: p.paymentDate,
        tenant: `${p.tenant.firstName} ${p.tenant.lastName}`,
        property: p.unit.property.name,
        unit: p.unit.unitNumber,
      })),
      monthlyData: Object.entries(monthlyData).map(([month, amount]) => ({
        month,
        amount,
      })).sort((a, b) => a.month.localeCompare(b.month)),
    };
  }

  async getPropertyReport(landlordId: string) {
    const properties = await this.prisma.property.findMany({
      where: { landlordId },
      include: {
        units: {
          include: {
            tenant: true,
          },
        },
      },
    });

    const propertyStats = properties.map(property => {
      const totalUnits = property.units.length;
      const occupiedUnits = property.units.filter(u => u.tenant).length;
      const vacantUnits = totalUnits - occupiedUnits;
      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
      const totalRent = property.units.reduce((sum, u) => sum + u.rentAmount, 0);
      const collectedRent = property.units
        .filter(u => u.tenant)
        .reduce((sum, u) => sum + u.rentAmount, 0);

      return {
        id: property.id,
        name: property.name,
        address: property.address,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        occupancyRate: Math.round(occupancyRate),
        totalRent,
        collectedRent,
      };
    });

    const totalUnits = propertyStats.reduce((sum, p) => sum + p.totalUnits, 0);
    const totalOccupied = propertyStats.reduce((sum, p) => sum + p.occupiedUnits, 0);
    const overallOccupancy = totalUnits > 0 ? Math.round((totalOccupied / totalUnits) * 100) : 0;

    return {
      properties: propertyStats,
      summary: {
        totalProperties: properties.length,
        totalUnits,
        totalOccupied,
        totalVacant: totalUnits - totalOccupied,
        overallOccupancy,
      },
    };
  }

  async getTenantReport(landlordId: string) {
    const tenants = await this.prisma.tenant.findMany({
      where: { landlordId },
      include: {
        unit: {
          include: {
            property: { select: { name: true } },
          },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
          take: 5,
        },
      },
    });

    const tenantStats = tenants.map(tenant => {
      const totalPayments = tenant.payments.length;
      const paidPayments = tenant.payments.filter(p => p.status === 'PAID').length;
      const latePayments = tenant.payments.filter(p => p.status === 'LATE').length;
      const totalPaid = tenant.payments.reduce((sum, p) => sum + p.amount, 0);

      return {
        id: tenant.id,
        name: `${tenant.firstName} ${tenant.lastName}`,
        email: tenant.email,
        phone: tenant.phone,
        property: tenant.unit?.property.name || 'N/A',
        unit: tenant.unit?.unitNumber || 'N/A',
        leaseStart: tenant.leaseStartDate,
        leaseEnd: tenant.leaseEndDate,
        totalPayments,
        paidPayments,
        latePayments,
        totalPaid,
      };
    });

    return {
      tenants: tenantStats,
      summary: {
        totalTenants: tenants.length,
        activeTenants: tenants.filter(t => t.unit).length,
        inactiveTenants: tenants.filter(t => !t.unit).length,
      },
    };
  }

  async getMaintenanceReport(landlordId: string, startDate?: Date, endDate?: Date) {
    const where: any = { unit: { property: { landlordId } } };
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const requests = await this.prisma.maintenanceRequest.findMany({
      where,
      include: {
        tenant: { select: { firstName: true, lastName: true } },
        unit: {
          select: {
            unitNumber: true,
            property: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingCount = requests.filter(r => r.status === 'PENDING').length;
    const inProgressCount = requests.filter(r => r.status === 'IN_PROGRESS').length;
    const completedCount = requests.filter(r => r.status === 'COMPLETED').length;
    const cancelledCount = requests.filter(r => r.status === 'CANCELLED').length;

    // Calculate average resolution time for completed requests
    const completedRequests = requests.filter(r => r.status === 'COMPLETED' && r.resolvedAt);
    const avgResolutionTime = completedRequests.length > 0
      ? completedRequests.reduce((sum, r) => {
          const time = r.resolvedAt!.getTime() - r.createdAt.getTime();
          return sum + time;
        }, 0) / completedRequests.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    return {
      requests: requests.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        status: r.status,
        priority: r.priority,
        tenant: `${r.tenant.firstName} ${r.tenant.lastName}`,
        property: r.unit.property.name,
        unit: r.unit.unitNumber,
        createdAt: r.createdAt,
        resolvedAt: r.resolvedAt,
      })),
      summary: {
        total: requests.length,
        pending: pendingCount,
        inProgress: inProgressCount,
        completed: completedCount,
        cancelled: cancelledCount,
        avgResolutionDays: Math.round(avgResolutionTime * 10) / 10,
      },
    };
  }

  async getVacancyReport(landlordId: string) {
    const listings = await this.prisma.vacantListing.findMany({
      where: { unit: { property: { landlordId } } },
      include: {
        unit: {
          include: {
            property: { select: { name: true } },
          },
        },
      },
      orderBy: { views: 'desc' },
    });

    const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
    const avgViews = listings.length > 0 ? totalViews / listings.length : 0;

    return {
      listings: listings.map(l => ({
        id: l.id,
        title: l.title,
        property: l.unit.property.name,
        unit: l.unit.unitNumber,
        rent: l.unit.rentAmount,
        views: l.views,
        postedDate: l.createdAt,
        status: l.status,
      })),
      summary: {
        totalListings: listings.length,
        activeListings: listings.filter(l => l.status === 'ACTIVE').length,
        inactiveListings: listings.filter(l => l.status === 'INACTIVE').length,
        totalViews,
        avgViews: Math.round(avgViews),
      },
    };
  }

  async getOverviewReport(landlordId: string) {
    // Get subscription info
    const landlord = await this.prisma.user.findUnique({
      where: { id: landlordId },
      select: {
        subscription: true,
        subscriptionExpiry: true,
      },
    });

    // Get counts
    const [properties, units, tenants, payments, maintenance, vacancies] = await Promise.all([
      this.prisma.property.count({ where: { landlordId } }),
      this.prisma.unit.count({ where: { property: { landlordId } } }),
      this.prisma.tenant.count({ where: { landlordId } }),
      this.prisma.payment.findMany({
        where: { landlordId },
        select: { amount: true, status: true },
      }),
      this.prisma.maintenanceRequest.count({
        where: { unit: { property: { landlordId } } },
      }),
      this.prisma.vacantListing.count({
        where: { unit: { property: { landlordId } } },
      }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments.filter(p => p.status === 'PENDING').length;

    return {
      subscription: {
        plan: landlord?.subscription || 'STARTER',
        expiryDate: landlord?.subscriptionExpiry,
        daysRemaining: landlord?.subscriptionExpiry
          ? Math.ceil((landlord.subscriptionExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : 0,
      },
      stats: {
        properties,
        units,
        tenants,
        totalRevenue,
        pendingPayments,
        maintenanceRequests: maintenance,
        vacantListings: vacancies,
      },
    };
  }
}
