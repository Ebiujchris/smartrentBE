import { IsEnum, IsNotEmpty } from 'class-validator';
import { SubscriptionPlan } from '@prisma/client';

export class UpdateSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  @IsNotEmpty()
  plan: SubscriptionPlan;
}
