import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SubscriptionPlan } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async updateSubscription(userId: string, updateDto: UpdateSubscriptionDto) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const { plan, maxUnits, amount } = this.getPlanDetails(updateDto.plan);

    if (subscription.plan !== plan) {
      if (
        subscription.status === 'TRIAL' &&
        (!subscription.trialEndsAt ||
          subscription.trialEndsAt > new Date())
      ) {
        throw new BadRequestException(
          'Your trial plan is locked until the free trial ends',
        );
      }
      throw new BadRequestException(
        'A verified payment is required to change your plan',
      );
    }

    // Update subscription
    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        plan,
        maxUnits,
        amount,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    return updated;
  }

  async assertTrialEnded(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      select: { status: true, trialEndsAt: true },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (
      subscription.status === 'TRIAL' &&
      (!subscription.trialEndsAt || subscription.trialEndsAt > new Date())
    ) {
      throw new BadRequestException(
        'Your free trial plan cannot be changed until the trial ends',
      );
    }
  }

  async applyVerifiedPayment(
    userId: string,
    updateDto: UpdateSubscriptionDto,
    transactionId: string,
  ) {
    const { plan, maxUnits, amount } = this.getPlanDetails(updateDto.plan);
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    return this.prisma.$transaction(async (tx) => {
      const claimed = await tx.pesapalTransaction.updateMany({
        where: {
          id: transactionId,
          status: 'successful',
          processedAt: null,
        },
        data: { processedAt: now },
      });

      if (claimed.count !== 1) return false;

      await tx.subscription.update({
        where: { userId },
        data: {
          plan,
          maxUnits,
          amount,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      });

      return true;
    });
  }

  getPlanDetails(plan: string) {
    switch (plan) {
      case 'STARTER':
        return {
          plan: SubscriptionPlan.STARTER,
          maxUnits: 7,
          amount: 75000,
        };
      case 'PROFESSIONAL':
        return {
          plan: SubscriptionPlan.PROFESSIONAL,
          maxUnits: 30,
          amount: 150000,
        };
      case 'PREMIUM':
        return {
          plan: SubscriptionPlan.PREMIUM,
          maxUnits: 9999,
          amount: 300000,
        };
      default:
        throw new BadRequestException('Unsupported subscription plan');
    }
  }

  async activateSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status !== 'TRIAL') {
      throw new BadRequestException('Subscription is not in trial status');
    }

    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        status: 'ACTIVE',
      },
    });

    return updated;
  }

  async activateSubscriptionAfterPayment(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const now = new Date();
    // Assuming a monthly billing cycle
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
      },
    });

    return updated;
  }

  async checkTrialExpiry(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return { expired: false };
    }

    if (subscription.status === 'TRIAL' && subscription.trialEndsAt) {
      const now = new Date();
      const expired = now > subscription.trialEndsAt;

      if (expired && subscription.status === 'TRIAL') {
        await this.prisma.subscription.update({
          where: { userId },
          data: { status: 'EXPIRED' },
        });
      }

      const daysRemaining = Math.ceil((subscription.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        expired,
        trialEndsAt: subscription.trialEndsAt,
        daysRemaining: Math.max(0, daysRemaining),
        isExpiringSoon: daysRemaining <= 7 && daysRemaining > 0,
      };
    }

    // Check if active subscription has expired (past currentPeriodEnd)
    if (subscription.status === 'ACTIVE' && subscription.currentPeriodEnd) {
      const now = new Date();
      const expired = now > subscription.currentPeriodEnd;

      if (expired) {
        await this.prisma.subscription.update({
          where: { userId },
          data: { status: 'EXPIRED' },
        });

        return {
          expired: true,
          currentPeriodEnd: subscription.currentPeriodEnd,
          daysRemaining: 0,
          isExpiringSoon: false,
        };
      }

      const daysRemaining = Math.ceil((subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        expired: false,
        currentPeriodEnd: subscription.currentPeriodEnd,
        daysRemaining: Math.max(0, daysRemaining),
        isExpiringSoon: daysRemaining <= 7 && daysRemaining > 0,
      };
    }

    return { expired: false };
  }
}
