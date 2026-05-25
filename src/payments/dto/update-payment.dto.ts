import { IsOptional, IsDateString, IsNumber, IsPositive, IsString, IsEnum } from 'class-validator';

export class UpdatePaymentDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsDateString()
  @IsOptional()
  paidDate?: string;

  @IsEnum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'])
  @IsOptional()
  status?: string;

  @IsEnum(['MTN_MOBILE_MONEY', 'AIRTEL_MONEY', 'BANK_TRANSFER', 'CASH', 'OTHER'])
  @IsOptional()
  method?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
