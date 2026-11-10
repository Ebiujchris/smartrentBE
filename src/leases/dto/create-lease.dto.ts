import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class CreateLeaseDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  unitId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  rentAmount: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  deposit: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(120)
  upfrontMonths: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  initialRentAmount: number;

  @IsEnum(PaymentMethod)
  initialPaymentMethod: PaymentMethod;

  @IsOptional()
  @IsDateString()
  initialPaidAt?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  depositReceived?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  depositPaymentMethod?: PaymentMethod;
}
