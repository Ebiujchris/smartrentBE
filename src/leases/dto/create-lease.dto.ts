import { IsNotEmpty, IsString, IsDateString, IsNumber, IsPositive } from 'class-validator';

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

  @IsNumber()
  @IsPositive()
  rentAmount: number;

  @IsNumber()
  @IsPositive()
  deposit: number;
}
