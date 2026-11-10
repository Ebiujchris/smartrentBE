import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  MinLength,
  IsEnum,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class RegisterTenantDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsNotEmpty()
  unitId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @Min(0)
  rentAmount: number;

  @IsNumber()
  @Min(0)
  deposit: number;

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(120)
  upfrontMonths: number;

  @IsNumber()
  @Min(0.01)
  initialRentAmount: number;

  @IsEnum(PaymentMethod)
  initialPaymentMethod: PaymentMethod;

  @IsOptional()
  @IsDateString()
  initialPaidAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  depositReceived?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  depositPaymentMethod?: PaymentMethod;
}