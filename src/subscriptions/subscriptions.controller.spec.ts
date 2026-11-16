import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SubscriptionsController } from './subscriptions.controller';

describe('SubscriptionsController payment verification', () => {
  const subscriptionsService = {
    getPlanDetails: jest.fn(() => ({
      plan: 'PROFESSIONAL',
      maxUnits: 30,
      amount: 150000,
    })),
    assertTrialEnded: jest.fn(),
    updateSubscription: jest.fn(),
    applyVerifiedPayment: jest.fn(),
  };
  const pesapalService = {
    initiatePayment: jest.fn(),
    verifyPayment: jest.fn(),
    findStoredTransaction: jest.fn(),
  };
  const controller = new SubscriptionsController(
    subscriptionsService as never,
    pesapalService as never,
  );
  const user = { id: 'user-1', email: 'tenant@example.test', fullName: 'User' };

  beforeEach(() => {
    jest.clearAllMocks();
    subscriptionsService.getPlanDetails.mockReturnValue({
      plan: 'PROFESSIONAL',
      maxUnits: 30,
      amount: 150000,
    });
    subscriptionsService.assertTrialEnded.mockResolvedValue(undefined);
    subscriptionsService.applyVerifiedPayment.mockResolvedValue(true);
    pesapalService.verifyPayment.mockResolvedValue({
      success: true,
      status: 'successful',
    });
  });

  it('uses the server plan price instead of a client-supplied amount', async () => {
    pesapalService.initiatePayment.mockResolvedValue({ success: true });

    await controller.initiatePayment(user, {
      planId: 'PROFESSIONAL',
      amount: 1,
      phoneNumber: '0701234567',
    });

    expect(pesapalService.initiatePayment).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 150000,
        metadata: expect.objectContaining({
          type: 'subscription',
          planId: 'PROFESSIONAL',
          userId: 'user-1',
        }),
      }),
    );
  });

  it('activates only a successful transaction for the same user and plan', async () => {
    pesapalService.findStoredTransaction.mockResolvedValue({
      id: 'stored-transaction-1',
      amount: new Prisma.Decimal(150000),
      currency: 'UGX',
      status: 'successful',
      metadata: {
        type: 'subscription',
        planId: 'PROFESSIONAL',
        userId: 'user-1',
      },
    });

    const result = await controller.verifyAndPurchase(user, {
      orderTrackingId: 'transaction-1',
      planId: 'PROFESSIONAL',
      amount: 1,
      phoneNumber: '0701234567',
    });

    expect(result.success).toBe(true);
    expect(subscriptionsService.applyVerifiedPayment).toHaveBeenCalledWith(
      'user-1',
      { plan: 'PROFESSIONAL' },
      'stored-transaction-1',
    );
  });

  it('does not apply a payment made for another account', async () => {
    pesapalService.findStoredTransaction.mockResolvedValue({
      id: 'stored-transaction-1',
      amount: new Prisma.Decimal(150000),
      currency: 'UGX',
      status: 'successful',
      metadata: {
        type: 'subscription',
        planId: 'PROFESSIONAL',
        userId: 'user-2',
      },
    });

    const result = await controller.verifyAndPurchase(user, {
      orderTrackingId: 'transaction-1',
      planId: 'PROFESSIONAL',
      amount: 150000,
      phoneNumber: '0701234567',
    });

    expect(result.success).toBe(false);
    expect(subscriptionsService.applyVerifiedPayment).not.toHaveBeenCalled();
  });
});
