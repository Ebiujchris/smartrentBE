import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from './reports.service';

describe('ReportsService financial totals', () => {
  const prisma = {
    payment: {
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
  };
  const service = new ReportsService(prisma as unknown as PrismaService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('counts partial receipts and only the remaining balance as due', async () => {
    prisma.payment.findMany.mockResolvedValue([
      payment('PARTIALLY_PAID', 1000, 400),
      payment('OVERDUE', 600, 100),
      payment('PAID', 200, 200),
    ]);

    const report = await service.getFinancial('owner-1');

    expect(report).toMatchObject({
      totalPaid: 700,
      totalPending: 600,
      totalOverdue: 500,
      totalExpected: 1800,
    });
    expect(report.payments[0]).toMatchObject({
      amount: 1000,
      paidAmount: 400,
      outstandingAmount: 600,
    });
    expect(prisma.payment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          lease: { unit: { property: { ownerId: 'owner-1' } } },
          status: { not: 'CANCELLED' },
        },
      }),
    );
  });

  it('uses inclusive due-date ranges and rejects invalid ranges', async () => {
    prisma.payment.findMany.mockResolvedValue([]);

    await service.getFinancial('owner-1', '2026-11-01', '2026-11-30');

    expect(prisma.payment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          dueDate: {
            gte: new Date('2026-11-01'),
            lte: new Date('2026-11-30T23:59:59.999Z'),
          },
        }),
      }),
    );

    await expect(
      service.getFinancial('owner-1', 'not-a-date', '2026-11-30'),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.getFinancial('owner-1', '2026-12-01', '2026-11-30'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

function payment(status: string, amount: number, paidAmount: number) {
  return {
    id: `payment-${status}`,
    status,
    amount,
    paidAmount,
    dueDate: new Date('2026-11-01T00:00:00.000Z'),
    paidDate: null,
    method: null,
    tenant: { user: { fullName: 'Tenant' } },
    lease: { unit: { unitNumber: '1', property: { name: 'Property' } } },
    allocations: [],
  };
}
