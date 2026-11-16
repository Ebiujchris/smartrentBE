import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsService plan changes', () => {
  const tx = {
    pesapalTransaction: { updateMany: jest.fn() },
    subscription: { update: jest.fn() },
  };
  const prisma = {
    subscription: { findUnique: jest.fn(), update: jest.fn() },
    $transaction: jest.fn((callback: (transaction: typeof tx) => unknown) =>
      callback(tx),
    ),
  };
  const service = new SubscriptionsService(prisma as unknown as PrismaService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('locks a different plan while the free trial is active', async () => {
    prisma.subscription.findUnique.mockResolvedValue({
      plan: 'STARTER',
      status: 'TRIAL',
      trialEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await expect(
      service.updateSubscription('user-1', { plan: 'PROFESSIONAL' }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.subscription.update).not.toHaveBeenCalled();
  });

  it('keeps a trial with no expiry date locked rather than allowing a bypass', async () => {
    prisma.subscription.findUnique.mockResolvedValue({
      plan: 'STARTER',
      status: 'TRIAL',
      trialEndsAt: null,
    });

    await expect(
      service.updateSubscription('user-1', { plan: 'PROFESSIONAL' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('requires payment to make a plan change after trial', async () => {
    prisma.subscription.findUnique.mockResolvedValue({
      plan: 'STARTER',
      status: 'EXPIRED',
      trialEndsAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    });

    await expect(
      service.updateSubscription('user-1', { plan: 'PROFESSIONAL' }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.subscription.update).not.toHaveBeenCalled();
  });

  it('applies each verified transaction once in an atomic update', async () => {
    tx.pesapalTransaction.updateMany.mockResolvedValueOnce({ count: 1 });

    const applied = await service.applyVerifiedPayment(
      'user-1',
      { plan: 'PROFESSIONAL' },
      'transaction-1',
    );

    expect(applied).toBe(true);
    expect(tx.pesapalTransaction.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'transaction-1',
          status: 'successful',
          processedAt: null,
        },
      }),
    );
    expect(tx.subscription.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1' },
        data: expect.objectContaining({
          plan: 'PROFESSIONAL',
          maxUnits: 30,
          amount: 150000,
          status: 'ACTIVE',
        }),
      }),
    );

    tx.pesapalTransaction.updateMany.mockResolvedValueOnce({ count: 0 });
    const appliedAgain = await service.applyVerifiedPayment(
      'user-1',
      { plan: 'PROFESSIONAL' },
      'transaction-1',
    );

    expect(appliedAgain).toBe(false);
    expect(tx.subscription.update).toHaveBeenCalledTimes(1);
  });
});
