import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TenantsService } from './tenants.service';

describe('TenantsService ownership', () => {
  let service: TenantsService;
  const prisma = {
    user: { findUnique: jest.fn() },
    tenant: {
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(TenantsService);
  });

  it('does not update a tenant without a lease in the landlord portfolio', async () => {
    prisma.tenant.findFirst.mockResolvedValue(null);

    await expect(
      service.update('tenant-b', { fullName: 'Changed Name' }, {
        id: 'landlord-a',
        role: 'LANDLORD',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.tenant.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'tenant-b',
        leases: { some: { unit: { property: { ownerId: 'landlord-a' } } } },
      },
    });
    expect(prisma.tenant.update).not.toHaveBeenCalled();
  });

  it('does not delete a tenant with tenancy or payment history', async () => {
    prisma.tenant.findFirst.mockResolvedValue({
      id: 'tenant-a',
      _count: { leases: 1, payments: 2 },
    });

    await expect(
      service.remove('tenant-a', { id: 'landlord-a', role: 'LANDLORD' }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.tenant.delete).not.toHaveBeenCalled();
  });

  it('does not create a tenant account for a unit outside the landlord portfolio', async () => {
    const tx = {
      unit: { findFirst: jest.fn().mockResolvedValue(null) },
      user: { create: jest.fn() },
      lease: { create: jest.fn() },
    };
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.$transaction.mockImplementation((callback) => callback(tx));

    await expect(
      service.register(
        { id: 'landlord-a', role: 'LANDLORD' },
        {
          email: 'tenant@example.com',
          password: 'password123',
          fullName: 'Tenant Example',
          unitId: 'unit-b',
          startDate: '2026-10-01',
          endDate: '2027-09-30',
          rentAmount: 500000,
          deposit: 500000,
        },
      ),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(tx.unit.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'unit-b',
        property: { ownerId: 'landlord-a' },
      },
    });
    expect(tx.user.create).not.toHaveBeenCalled();
  });
});