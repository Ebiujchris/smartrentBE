import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsEnum(['STARTER', 'PROFESSIONAL', 'PREMIUM'])
  @IsNotEmpty()
  plan: string;
}
