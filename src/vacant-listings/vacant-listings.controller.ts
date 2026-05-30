import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  ParseFloatPipe,
} from '@nestjs/common';
import { VacantListingsService } from './vacant-listings.service';
import { CreateVacantListingDto } from './dto/create-vacant-listing.dto';
import { UpdateVacantListingDto } from './dto/update-vacant-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('vacant-listings')
export class VacantListingsController {
  constructor(private readonly vacantListingsService: VacantListingsService) {}

  // CREATE - LANDLORD only
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LANDLORD, UserRole.PROPERTY_MANAGER, UserRole.ADMIN)
  create(
    @CurrentUser() user: any,
    @Body() createVacantListingDto: CreateVacantListingDto,
  ) {
    return this.vacantListingsService.create(user.id, createVacantListingDto);
  }

  // GET ALL PUBLIC - No auth required
  @Get()
  findAllPublic(
    @Query('bedrooms', new ParseIntPipe({ optional: true })) bedrooms?: number,
    @Query('minPrice', new ParseFloatPipe({ optional: true })) minPrice?: number,
    @Query('maxPrice', new ParseFloatPipe({ optional: true })) maxPrice?: number,
    @Query('location') location?: string,
  ) {
    return this.vacantListingsService.findAllPublic({
      bedrooms,
      minPrice,
      maxPrice,
      location,
    });
  }

  // GET MY LISTINGS - LANDLORD only
  @Get('my-listings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LANDLORD, UserRole.PROPERTY_MANAGER, UserRole.ADMIN)
  findMyListings(@CurrentUser() user: any) {
    return this.vacantListingsService.findMyListings(user.id);
  }

  // GET ONE - Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacantListingsService.findOne(id);
  }

  // UPDATE - LANDLORD only (with owner check)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LANDLORD, UserRole.PROPERTY_MANAGER, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateVacantListingDto: UpdateVacantListingDto,
  ) {
    return this.vacantListingsService.update(id, user.id, updateVacantListingDto);
  }

  // DELETE - LANDLORD only (with owner check)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LANDLORD, UserRole.PROPERTY_MANAGER, UserRole.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.vacantListingsService.remove(id, user.id);
  }

  // INCREMENT VIEW COUNT - Public
  @Patch(':id/increment-view')
  incrementViewCount(@Param('id') id: string) {
    return this.vacantListingsService.incrementViewCount(id);
  }
}
