import { IsString, IsNotEmpty, IsNumber, IsDateString, IsArray, IsOptional, Min } from 'class-validator';

export class UpdateContractDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  tenantId?: string;

  @IsString()
  @IsOptional()
  propertyName?: string;

  @IsString()
  @IsOptional()
  unitNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  rentAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  deposit?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  duration?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  terms?: string[];
}
