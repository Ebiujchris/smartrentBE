import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ContactPurchasesService } from './contact-purchases.service';

describe('ContactPurchasesService payment verification', () => {
  let service: ContactPurchasesService;
  const prisma = {
    pesapalTransaction: { findFirst: jest.fn() },
    vacantListing: { findUnique: jest.fn() },
    contactPurchase: { findFirst: jest.fn(), create: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    prisma.pesapalTransaction.findFirst.mockResolvedValue({
      txRef: 'contact-ref',
      orderTrackingId: 'provider-ref',
      amount: new Prisma.Decimal(10000),
      currency: 'UGX',
      phoneNumber: '256701234567',
      status: 'successful',
      paymentMethod: 'Mobile Money',
      metadata: {
        type: 'contact_purchase',
        listingId: 'listing-1',
      },
    });
    prisma.vacantListing.findUnique.mockResolvedValue({ id: 'listing-1' });
    prisma.contactPurchase.findFirst.mockResolvedValue(null);
    prisma.contactPurchase.create.mockResolvedValue({ id: 'purchase-1' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactPurchasesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ContactPurchasesService>(ContactPurchasesService);
  });

  it('creates a purchase only for a matching verified transaction', async () => {
    await service.createVerifiedPurchase({
      listingId: 'listing-1',
      buyerPhone: '0701234567',
      orderTrackingId: 'provider-ref',
    });

    expect(prisma.contactPurchase.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          listingId: 'listing-1',
          buyerPhone: '0701234567',
          transactionId: 'provider-ref',
          amountPaid: 10000,
        }),
      }),
    );
  });

  it('rejects unverified and mismatched payments without creating a purchase', async () => {
    prisma.pesapalTransaction.findFirst.mockResolvedValueOnce({
      status: 'pending',
      amount: new Prisma.Decimal(10000),
      currency: 'UGX',
    });

    await expect(
      service.createVerifiedPurchase({
        listingId: 'listing-1',
        buyerPhone: '0701234567',
        orderTrackingId: 'provider-ref',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    prisma.pesapalTransaction.findFirst.mockResolvedValueOnce({
      txRef: 'contact-ref',
      orderTrackingId: 'provider-ref',
      amount: new Prisma.Decimal(10000),
      currency: 'UGX',
      phoneNumber: '256701234567',
      status: 'successful',
      metadata: { type: 'contact_purchase', listingId: 'other-listing' },
    });

    await expect(
      service.createVerifiedPurchase({
        listingId: 'listing-1',
        buyerPhone: '0701234567',
        orderTrackingId: 'provider-ref',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.contactPurchase.create).not.toHaveBeenCalled();
  });
});
