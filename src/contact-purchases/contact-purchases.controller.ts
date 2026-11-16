import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ContactPurchasesService } from './contact-purchases.service';
import { PesapalService } from '../payments/pesapal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('contact-purchases')
export class ContactPurchasesController {
  constructor(
    private readonly service: ContactPurchasesService,
    private readonly pesapalService: PesapalService,
  ) {}

  @Post('check')
  @HttpCode(200)
  async checkPurchase(
    @Body() dto: { listingId: string; buyerPhone: string }
  ) {
    const hasPurchased = await this.service.hasPurchased(dto.listingId, dto.buyerPhone);
    return { hasPurchased };
  }

  @Post('initiate-payment')
  @HttpCode(200)
  async initiatePayment(@Body() dto: {
    listingId: string;
    buyerPhone: string;
    buyerEmail?: string;
    buyerName?: string;
  }) {
    // Check if already purchased
    const alreadyPurchased = await this.service.hasPurchased(dto.listingId, dto.buyerPhone);
    if (alreadyPurchased) {
      return {
        success: false,
        message: 'You have already purchased this contact',
      };
    }

    // Generate unique transaction reference
    const txRef = `CONTACT_${dto.listingId}_${Date.now()}`;

    // Initiate Pesapal payment
    const paymentResponse = await this.pesapalService.initiatePayment({
      amount: 10000,
      phoneNumber: dto.buyerPhone,
      email: dto.buyerEmail || 'customer@smartrentug.com',
      reference: txRef,
      description: 'Contact Purchase - SmartRentUG',
      metadata: {
        type: 'contact_purchase',
        listingId: dto.listingId,
        buyerName: dto.buyerName,
      },
    });

    return {
      ...paymentResponse,
      txRef,
    };
  }

  @Post('verify-and-purchase')
  @HttpCode(200)
  async verifyAndPurchase(@Body() dto: {
    orderTrackingId: string;
    listingId: string;
    buyerPhone: string;
    buyerEmail?: string;
    buyerName?: string;
  }) {
    // Verify payment with Pesapal
    const verification = await this.pesapalService.verifyPayment(dto.orderTrackingId);

    if (!verification.success || verification.status !== 'successful') {
      return {
        success: false,
        message: 'Payment not confirmed. Please try again.',
        status: verification.status,
      };
    }

    // Create purchase record
    const purchase = await this.service.createVerifiedPurchase({
      listingId: dto.listingId,
      buyerPhone: dto.buyerPhone,
      buyerEmail: dto.buyerEmail,
      buyerName: dto.buyerName,
      orderTrackingId: dto.orderTrackingId,
    });

    // Get contact info
    const contact = await this.service.getContactInfo(dto.listingId, dto.buyerPhone);

    return {
      success: true,
      message: 'Payment successful! Contact revealed.',
      contact,
      purchase,
    };
  }

  @Get('contact')
  async getContact(
    @Query('listingId') listingId: string,
    @Query('buyerPhone') buyerPhone: string,
  ) {
    return this.service.getContactInfo(listingId, buyerPhone);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllPurchases() {
    return this.service.getAllPurchases();
  }
}
