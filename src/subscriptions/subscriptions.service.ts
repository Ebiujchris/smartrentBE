import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    // Determine max units and amount based on plan
    let maxUnits = 7;
    let amount = 75000;

    switch (updateDto.plan) {
      case 'STARTER':
        maxUnits = 7;
        amount = 75000;
        break;
      case 'PROFESSIONAL':
        maxUnits = 30;
        amount = 150000;
        break;
      case 'PREMIUM':
        maxUnits = 9999; // Unlimited
        amount = 300000;
        break;
    }

    // Update subscription
    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        plan: updateDto.plan as any,
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

      return {
        expired,
        trialEndsAt: subscription.trialEndsAt,
        daysRemaining: Math.ceil((subscription.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      };
    }

    return { expired: false };
  }
}
