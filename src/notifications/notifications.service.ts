import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma, RentReminderType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getUserNotifications(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 notifications
    });

    return notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.isRead,
      createdAt: n.createdAt.toISOString(),
    }));
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  // Helper method to create notifications (used by other services)
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO',
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }

  async dispatchRentReminders() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const leases = await this.prisma.lease.findMany({
      where: { isActive: true },
      include: {
        tenant: { include: { user: { select: { id: true, fullName: true } } } },
        unit: { include: { property: { select: { name: true, ownerId: true } } } },
        payments: {
          where: { status: { in: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'] } },
          orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    let sent = 0;
    for (const lease of leases) {
      const recipients = [...new Set([lease.tenant.user.id, lease.unit.property.ownerId])];
      const nextRentDue = lease.payments.find(
        (payment) => Number(payment.paidAmount) < Number(payment.amount),
      );

      if (nextRentDue) {
        const created = await this.createLeaseReminder(
          lease.id,
          RentReminderType.RENT_DUE,
          nextRentDue.dueDate,
          recipients,
          'Rent due soon',
          `${lease.tenant.user.fullName}'s rent of UGX ${Number(nextRentDue.amount).toLocaleString()} is due on ${nextRentDue.dueDate.toLocaleDateString('en-UG')}.`,
        );
        if (created) sent += recipients.length;
      }

      const leaseEnd = new Date(lease.endDate);
      leaseEnd.setUTCHours(0, 0, 0, 0);
      const created = await this.createLeaseReminder(
        lease.id,
        RentReminderType.LEASE_END,
        leaseEnd,
        recipients,
        'Tenancy end date approaching',
        `${lease.tenant.user.fullName}'s tenancy at ${lease.unit.property.name}, Unit ${lease.unit.unitNumber} is scheduled to end on ${leaseEnd.toLocaleDateString('en-UG')}. Review renewal or manually end the tenancy.`,
      );
      if (created) sent += recipients.length;
    }

    return { remindersSent: sent };
  }

  private async createLeaseReminder(
    leaseId: string,
    type: RentReminderType,
    targetDate: Date,
    recipients: string[],
    title: string,
    message: string,
  ) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setUTCHours(0, 0, 0, 0);
    const daysUntil = Math.floor((target.getTime() - today.getTime()) / 86_400_000);
    if (daysUntil < 0 || daysUntil > 14) return false;

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.rentReminder.create({
          data: { leaseId, type, targetDate: target },
        });
        await tx.notification.createMany({
          data: recipients.map((userId) => ({
            userId,
            title,
            message: `${message} (${daysUntil} days remaining.)`,
            type: 'WARNING',
          })),
        });
      });
      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return false;
      }
      throw error;
    }
  }
}
