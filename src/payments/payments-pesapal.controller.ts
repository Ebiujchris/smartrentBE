import { Controller, Post, Get, Body, Query, HttpCode } from '@nestjs/common';
import { PesapalService } from './pesapal.service';

@Controller('payments/pesapal')
export class PaymentsPesapalController {
  constructor(private readonly pesapalService: PesapalService) {}

  @Post('initiate')
  @HttpCode(200)
  async initiatePayment(@Body() body: {
    amount: number;
    phoneNumber: string;
    email: string;
    reference: string;
    description?: string;
    metadata?: any;
  }) {
    return this.pesapalService.initiatePayment(body);
  }

  @Get('verify')
  async verifyPayment(@Query('orderTrackingId') orderTrackingId: string) {
    return this.pesapalService.verifyPayment(orderTrackingId);
  }

  @Get('status')
  async getStatus(@Query('txRef') txRef: string) {
    const status = await this.pesapalService.getTransactionStatus(txRef);
    return { txRef, status };
  }

  @Get('ipn')
  @HttpCode(200)
  async handleIPN(
    @Query('OrderTrackingId') orderTrackingId: string,
    @Query('OrderMerchantReference') merchantReference: string,
  ) {
    await this.pesapalService.handleIPN(orderTrackingId);
    return { message: 'IPN processed' };
  }
}
