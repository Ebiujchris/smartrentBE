import { Controller, Get, Patch, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { PesapalService } from '../payments/pesapal.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

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
    const txRef = `SUB_${dto.planId}_${user.id}_${Date.now()}`;
    
    // Add logic to determine the name of the plan based on planId if needed
    let planName = dto.planId;
    
    const paymentResponse = await this.pesapalService.initiatePayment({
      amount: dto.amount,
      phoneNumber: dto.phoneNumber,
      email: user.email,
      reference: txRef,
      description: `SmartRent Subscription - ${planName}`,
      metadata: {
        type: 'subscription',
        planId: dto.planId,
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
    const verification = await this.pesapalService.verifyPayment(dto.orderTrackingId);

    if (!verification.success || verification.status !== 'successful') {
      return {
        success: false,
        message: 'Payment not confirmed. Please try again.',
        status: verification.status,
      };
    }

    // Now update the subscription
    await this.subscriptionsService.updateSubscription(user.id, { plan: dto.planId });
    await this.subscriptionsService.activateSubscriptionAfterPayment(user.id);

    return {
      success: true,
      message: 'Payment successful! Subscription renewed.',
    };
  }
}
