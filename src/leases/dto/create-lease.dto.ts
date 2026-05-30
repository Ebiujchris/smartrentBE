import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

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
}
