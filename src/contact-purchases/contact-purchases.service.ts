import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  // Create contact purchase (after payment verification)
  async createPurchase(data: {
    listingId: string;
    buyerPhone: string;
    buyerEmail?: string;
    buyerName?: string;
    paymentMethod: string;
    transactionId: string;
  }) {
    // Verify listing exists
    const listing = await this.prisma.vacantListing.findUnique({
      where: { id: data.listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Check if already purchased
    const existing = await this.hasPurchased(data.listingId, data.buyerPhone);
    if (existing) {
      throw new BadRequestException('Contact already purchased for this listing');
    }

    // Create purchase record
    const purchase = await this.prisma.contactPurchase.create({
      data: {
        listingId: data.listingId,
        buyerPhone: data.buyerPhone,
        buyerEmail: data.buyerEmail,
        buyerName: data.buyerName,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        amountPaid: 10000,
      },
    });

    return purchase;
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
