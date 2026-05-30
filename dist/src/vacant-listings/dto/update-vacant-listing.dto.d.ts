import { CreateVacantListingDto } from './create-vacant-listing.dto';
declare const UpdateVacantListingDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateVacantListingDto>>;
export declare class UpdateVacantListingDto extends UpdateVacantListingDto_base {
    isActive?: boolean;
}
export {};
