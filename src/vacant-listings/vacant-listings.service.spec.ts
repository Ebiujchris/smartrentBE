import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { VacantListingsService } from './vacant-listings.service';

describe('VacantListingsService available units', () => {
  let service: VacantListingsService;
  const prisma = {
    user: { findUnique: jest.fn() },
    unit: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacantListingsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(VacantListingsService);
  });

  it('returns only unadvertised vacant units in the landlord portfolio', async () => {
    prisma.user.findUnique.mockResolvedValue({
      subscription: { plan: 'PROFESSIONAL' },
    });
    prisma.unit.findMany.mockResolvedValue([]);

    await service.findAvailableUnits('landlord-a');

    expect(prisma.unit.findMany).toHaveBeenCalledWith({
      where: {
        status: 'VACANT',
        property: { ownerId: 'landlord-a' },
        leases: { none: { isActive: true } },
        vacantListing: { is: null },
      },
      include: {
        property: { select: { id: true, name: true, address: true } },
      },
      orderBy: [
        { property: { name: 'asc' } },
        { unitNumber: 'asc' },
      ],
    });
  });
});