import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { UnitStatus } from '@prisma/client';

export class UpdateUnitDto {
  @IsOptional()
  @IsString()
  unitNumber?: string;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsNumber()
  rentAmount?: number;

  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;
}
