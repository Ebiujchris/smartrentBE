import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { LeasesService } from './leases.service';

describe('LeasesService ownership', () => {
  let service: LeasesService;
  const prisma = {
    unit: { findFirst: jest.fn() },
    tenant: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeasesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(LeasesService);
  });

  it('does not create a lease on a unit outside the landlord portfolio', async () => {
    prisma.unit.findFirst.mockResolvedValue(null);

    await expect(
      service.create(
        { id: 'landlord-a', role: 'LANDLORD' },
        {
          tenantId: 'tenant-b',
          unitId: 'unit-b',
          startDate: '2026-10-01',
          endDate: '2027-09-30',
          rentAmount: 500000,
          deposit: 500000,
          upfrontMonths: 3,
          initialRentAmount: 1500000,
          initialPaymentMethod: 'CASH',
        },
      ),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.unit.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'unit-b',
        property: { ownerId: 'landlord-a' },
      },
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});