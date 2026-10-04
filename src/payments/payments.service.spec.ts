import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from './payments.service';

describe('PaymentsService ownership', () => {
  let service: PaymentsService;
  const prisma = {
    lease: { findFirst: jest.fn() },
    payment: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(PaymentsService);
  });

  it('does not create a payment against a lease outside the landlord portfolio', async () => {
    prisma.lease.findFirst.mockResolvedValue(null);

    await expect(
      service.create(
        { id: 'landlord-a', role: 'LANDLORD' },
        {
          leaseId: 'lease-b',
          tenantId: 'tenant-b',
          amount: 500000,
          dueDate: '2026-10-01',
        },
      ),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.lease.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'lease-b',
        tenantId: 'tenant-b',
        unit: { property: { ownerId: 'landlord-a' } },
      },
      select: { id: true },
    });
    expect(prisma.payment.create).not.toHaveBeenCalled();
  });

  it('does not expose a payment owned by another landlord', async () => {
    prisma.payment.findFirst.mockResolvedValue(null);

    await expect(
      service.findOne('payment-b', { id: 'landlord-a', role: 'LANDLORD' }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.payment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'payment-b',
          lease: { unit: { property: { ownerId: 'landlord-a' } } },
        },
      }),
    );
  });

  it('allows a tenant to retrieve their own payment', async () => {
    prisma.payment.findFirst.mockResolvedValue({ id: 'payment-a' });

    await service.findOne('payment-a', { id: 'tenant-user-a', role: 'TENANT' });

    expect(prisma.payment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'payment-a', tenant: { userId: 'tenant-user-a' } },
      }),
    );
  });

  it('does not record a payment owned by another landlord', async () => {
    prisma.payment.findFirst.mockResolvedValue(null);

    await expect(
      service.recordPayment('payment-b', { id: 'landlord-a', role: 'LANDLORD' }, 'CASH'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.payment.update).not.toHaveBeenCalled();
  });
});