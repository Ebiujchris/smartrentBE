import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

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
}
