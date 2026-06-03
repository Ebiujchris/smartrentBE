import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVacantListingDto } from './dto/create-vacant-listing.dto';
import { UpdateVacantListingDto } from './dto/update-vacant-listing.dto';

@Injectable()
export class VacantListingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateVacantListingDto) {
    // Check user's subscription plan - only Professional and Premium can advertise
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user?.subscription) {
      throw new ForbiddenException('No active subscription found');
    }

    if (user.subscription.plan === 'STARTER') {
      throw new ForbiddenException(
        'Vacancy advertising is only available on Professional and Premium plans. Please upgrade your subscription.',
      );
    }

    // Verify the unit exists and belongs to the landlord
    const unit = await this.prisma.unit.findUnique({
      where: { id: createDto.unitId },
      include: {
        property: true,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (unit.property.ownerId !== userId) {
      throw new ForbiddenException('You do not own this unit');
    }

    // Check if a listing already exists for this unit
    const existingListing = await this.prisma.vacantListing.findUnique({
      where: { unitId: createDto.unitId },
    });

    if (existingListing) {
      throw new BadRequestException('A listing already exists for this unit');
    }

    // Create the vacant listing
    const listing = await this.prisma.vacantListing.create({
      data: {
        ...createDto,
        availableFrom: new Date(createDto.availableFrom),
      },
      include: {
        unit: {
          include: {
            property: {
              include: {
                owner: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return listing;
  }

  async findAllPublic(filters?: {
    bedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }) {
    const where: any = {
      isActive: true,
    };

    // Apply filters if provided
    if (filters?.bedrooms) {
      where.unit = {
        ...where.unit,
        bedrooms: filters.bedrooms,
      };
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.unit = {
        ...where.unit,
        rentAmount: {
          ...(filters.minPrice && { gte: filters.minPrice }),
          ...(filters.maxPrice && { lte: filters.maxPrice }),
        },
      };
    }

    if (filters?.location) {
      where.unit = {
        ...where.unit,
        property: {
          address: {
            contains: filters.location,
            mode: 'insensitive',
          },
        },
      };
    }

    const listings = await this.prisma.vacantListing.findMany({
      where,
      include: {
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
                address: true,
                description: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return listings;
  }

  async findMyListings(userId: string) {
    // Check user's subscription plan
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user?.subscription) {
      throw new ForbiddenException('No active subscription found');
    }

    if (user.subscription.plan === 'STARTER') {
      throw new ForbiddenException(
        'Vacancy advertising is only available on Professional and Premium plans.',
      );
    }

    // Get all listings for units owned by this user
    const listings = await this.prisma.vacantListing.findMany({
      where: {
        unit: {
          property: {
            ownerId: userId,
          },
        },
      },
      include: {
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
                address: true,
                description: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return listings;
  }

  async findOne(id: string) {
    const listing = await this.prisma.vacantListing.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            property: {
              include: {
                owner: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async update(id: string, userId: string, updateDto: UpdateVacantListingDto) {
    // Get the listing with ownership info
    const listing = await this.prisma.vacantListing.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.unit.property.ownerId !== userId) {
      throw new ForbiddenException('You do not own this listing');
    }

    // If updating unitId, verify the new unit belongs to the landlord
    if (updateDto.unitId && updateDto.unitId !== listing.unitId) {
      const newUnit = await this.prisma.unit.findUnique({
        where: { id: updateDto.unitId },
        include: { property: true },
      });

      if (!newUnit) {
        throw new NotFoundException('New unit not found');
      }

      if (newUnit.property.ownerId !== userId) {
        throw new ForbiddenException('You do not own the new unit');
      }

      // Check if a listing already exists for the new unit
      const existingListing = await this.prisma.vacantListing.findUnique({
        where: { unitId: updateDto.unitId },
      });

      if (existingListing && existingListing.id !== id) {
        throw new BadRequestException('A listing already exists for this unit');
      }
    }

    // Update the listing
    const updatedListing = await this.prisma.vacantListing.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.availableFrom && {
          availableFrom: new Date(updateDto.availableFrom),
        }),
      },
      include: {
        unit: {
          include: {
            property: {
              include: {
                owner: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return updatedListing;
  }

  async remove(id: string, userId: string) {
    // Get the listing with ownership info
    const listing = await this.prisma.vacantListing.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.unit.property.ownerId !== userId) {
      throw new ForbiddenException('You do not own this listing');
    }

    await this.prisma.vacantListing.delete({
      where: { id },
    });

    return { message: 'Listing deleted successfully' };
  }

  async incrementViewCount(id: string) {
    // Check if listing exists
    const listing = await this.prisma.vacantListing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Increment view count
    const updatedListing = await this.prisma.vacantListing.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      include: {
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
                address: true,
                description: true,
              },
            },
          },
        },
      },
    });

    return updatedListing;
  }
}
