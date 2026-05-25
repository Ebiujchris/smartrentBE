import { IsOptional, IsDateString, IsNumber, IsPositive, IsBoolean } from 'class-validator';

export class UpdateLeaseDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  rentAmount?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  deposit?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
