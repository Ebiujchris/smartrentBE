import { IsNotEmpty, IsString, IsDateString, IsNumber, IsPositive, IsOptional, IsEnum } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  leaseId: string;

  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

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
