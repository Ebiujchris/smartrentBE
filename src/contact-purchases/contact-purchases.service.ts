import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactPurchasesService {
  constructor(private prisma: PrismaService) {}

  // Check if buyer has already purchased contact for this listing
  async hasPurchased(listingId: string, buyerPhone: string): Promise<boolean> {
    const purchase = await this.prisma.contactPurchase.findFirst({
      where: {
        listingId,
        buyerPhone,
      },
    });
    return !!purchase;
  }

  async createVerifiedPurchase(data: {
    listingId: string;
    buyerPhone: string;
    buyerEmail?: string;
    buyerName?: string;
    orderTrackingId: string;
  }) {
    const transaction = await this.prisma.pesapalTransaction.findFirst({
      where: {
        OR: [
          { orderTrackingId: data.orderTrackingId },
          { txRef: data.orderTrackingId },
        ],
      },
    });

    if (
      !transaction ||
      transaction.status !== 'successful' ||
      transaction.currency !== 'UGX' ||
      !new Prisma.Decimal(transaction.amount).eq(10000)
    ) {
      throw new BadRequestException('A verified UGX 10,000 payment is required');
    }

    const metadata = transaction.metadata;
    if (
      !metadata ||
      typeof metadata !== 'object' ||
      Array.isArray(metadata) ||
      metadata.type !== 'contact_purchase' ||
      metadata.listingId !== data.listingId ||
      normalizeUgandanPhone(transaction.phoneNumber) !==
        normalizeUgandanPhone(data.buyerPhone)
    ) {
      throw new BadRequestException(
        'Payment does not match this listing and buyer',
      );
    }

    const listing = await this.prisma.vacantListing.findUnique({
      where: { id: data.listingId },
      select: { id: true },
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const existing = await this.prisma.contactPurchase.findFirst({
      where: {
        listingId: data.listingId,
        buyerPhone: data.buyerPhone,
      },
    });
    if (existing) {
      return existing;
    }

    return this.prisma.contactPurchase.create({
      data: {
        listingId: data.listingId,
        buyerPhone: data.buyerPhone,
        buyerEmail: data.buyerEmail,
        buyerName: data.buyerName,
        paymentMethod: transaction.paymentMethod || 'PESAPAL',
        transactionId: transaction.orderTrackingId || transaction.txRef,
        amountPaid: 10000,
      },
    });
  }

  // Get contact info (only if purchased)
  async getContactInfo(listingId: string, buyerPhone: string) {
    const hasPurchased = await this.hasPurchased(listingId, buyerPhone);
    
    if (!hasPurchased) {
      throw new BadRequestException('Contact not purchased. Please purchase to view.');
    }

    const listing = await this.prisma.vacantListing.findUnique({
      where: { id: listingId },
      select: {
        contactName: true,
        contactPhone: true,
        contactEmail: true,
      },
    });

    // Update last accessed timestamp
    await this.prisma.contactPurchase.updateMany({
      where: {
        listingId,
        buyerPhone,
      },
      data: {
        lastAccessedAt: new Date(),
      },
    });

    return listing;
  }

  // Get all purchases for admin/reports
  async getAllPurchases() {
    return this.prisma.contactPurchase.findMany({
      include: {
        listing: {
          include: {
            unit: {
              include: {
                property: true,
              },
            },
          },
        },
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });
  }
}

function normalizeUgandanPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('256')) return digits;
  if (digits.startsWith('0')) return `256${digits.slice(1)}`;
  return `256${digits}`;
}
