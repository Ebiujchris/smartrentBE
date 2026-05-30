import { PartialType } from '@nestjs/mapped-types';
import { CreateVacantListingDto } from './create-vacant-listing.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVacantListingDto extends PartialType(CreateVacantListingDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
