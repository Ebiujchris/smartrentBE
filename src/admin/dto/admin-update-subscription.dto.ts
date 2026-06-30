import { IsOptional, IsEnum, IsInt, IsNumber, IsDateString, Min } from 'class-validator';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

export class AdminUpdateSubscriptionDto {
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  plan?: SubscriptionPlan;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUnits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsDateString()
  trialEndsAt?: string;

  @IsOptional()
  @IsDateString()
  currentPeriodEnd?: string;
}
