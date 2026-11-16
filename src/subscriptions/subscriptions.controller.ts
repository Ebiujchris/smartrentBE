import { Controller, Get, Patch, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { PesapalService } from '../payments/pesapal.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Prisma } from '@prisma/client';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly pesapalService: PesapalService,
  ) {}

  @Get()
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  getSubscription(@CurrentUser() user: any) {
    return this.subscriptionsService.getSubscription(user.id);
  }

  @Patch()
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  updateSubscription(@CurrentUser() user: any, @Body() updateDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.updateSubscription(user.id, updateDto);
  }

  @Get('trial-status')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  checkTrialExpiry(@CurrentUser() user: any) {
    return this.subscriptionsService.checkTrialExpiry(user.id);
  }

  @Post('initiate-payment')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  @HttpCode(200)
  async initiatePayment(
    @CurrentUser() user: any,
    @Body() dto: { planId: string; amount: number; phoneNumber: string }
  ) {
    await this.subscriptionsService.assertTrialEnded(user.id);
    const plan = this.subscriptionsService.getPlanDetails(dto.planId);
    const txRef = `SUB_${dto.planId}_${user.id}_${Date.now()}`;

    const paymentResponse = await this.pesapalService.initiatePayment({
      amount: plan.amount,
      phoneNumber: dto.phoneNumber,
      email: user.email,
      reference: txRef,
      description: `SmartRent Subscription - ${dto.planId}`,
      metadata: {
        type: 'subscription',
        planId: plan.plan,
        userId: user.id,
        buyerName: user.fullName || 'User',
      },
    });

    return {
      ...paymentResponse,
      txRef,
    };
  }

  @Post('verify-and-purchase')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  @HttpCode(200)
  async verifyAndPurchase(
    @CurrentUser() user: any,
    @Body() dto: { orderTrackingId: string; planId: string; amount: number; phoneNumber: string }
  ) {
    await this.subscriptionsService.assertTrialEnded(user.id);
    const verification = await this.pesapalService.verifyPayment(dto.orderTrackingId);
    const transaction = await this.pesapalService.findStoredTransaction(
      dto.orderTrackingId,
    );
    const plan = this.subscriptionsService.getPlanDetails(dto.planId);
    const metadata = transaction?.metadata;
    const matchesOrder =
      !!transaction?.id &&
      transaction?.status === 'successful' &&
      transaction.currency === 'UGX' &&
      new Prisma.Decimal(transaction.amount).eq(plan.amount) &&
      !!metadata &&
      typeof metadata === 'object' &&
      !Array.isArray(metadata) &&
      metadata.type === 'subscription' &&
      metadata.planId === plan.plan &&
      metadata.userId === user.id;

    if (
      !verification.success ||
      verification.status !== 'successful' ||
      !matchesOrder
    ) {
      return {
        success: false,
        message: 'Payment could not be matched to this account and plan.',
        status: verification.status,
      };
    }

    // Now update the subscription
    const applied = await this.subscriptionsService.applyVerifiedPayment(
      user.id,
      { plan: plan.plan },
      transaction.id,
    );

    return {
      success: true,
      message: applied
        ? 'Payment successful! Subscription renewed.'
        : 'This payment was already applied to your subscription.',
    };
  }
}
