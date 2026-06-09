import { Controller, Post, Get, Body, Query, HttpCode } from '@nestjs/common';
import { ContactPurchasesService } from './contact-purchases.service';

@Controller('contact-purchases')
export class ContactPurchasesController {
  constructor(private readonly service: ContactPurchasesService) {}

  @Post('check')
  @HttpCode(200)
  async checkPurchase(
    @Body() dto: { listingId: string; buyerPhone: string }
  ) {
    const hasPurchased = await this.service.hasPurchased(dto.listingId, dto.buyerPhone);
    return { hasPurchased };
  }

  @Post('purchase')
  async createPurchase(@Body() dto: {
    listingId: string;
    buyerPhone: string;
    buyerEmail?: string;
    buyerName?: string;
    paymentMethod: string;
    transactionId: string;
  }) {
    return this.service.createPurchase(dto);
  }

  @Get('contact')
  async getContact(
    @Query('listingId') listingId: string,
    @Query('buyerPhone') buyerPhone: string,
  ) {
    return this.service.getContactInfo(listingId, buyerPhone);
  }

  @Get('all')
  async getAllPurchases() {
    return this.service.getAllPurchases();
  }
}
