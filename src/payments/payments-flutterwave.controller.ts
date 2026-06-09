import { Controller, Post, Get, Body, Query, Headers, HttpCode } from '@nestjs/common';
import { FlutterwaveService } from './flutterwave.service';

@Controller('payments/flutterwave')
export class PaymentsFlutterwaveController {
  constructor(private readonly flutterwaveService: FlutterwaveService) {}

  @Post('initiate')
  @HttpCode(200)
  async initiatePayment(@Body() body: {
    amount: number;
    phoneNumber: string;
    email: string;
    network: 'MTN' | 'AIRTEL';
    reference: string;
    metadata?: any;
  }) {
    return this.flutterwaveService.initiateMobileMoneyPayment(body);
  }

  @Get('verify')
  async verifyPayment(@Query('txRef') txRef: string) {
    return this.flutterwaveService.verifyPayment(txRef);
  }

  @Get('status')
  async getStatus(@Query('txRef') txRef: string) {
    const status = await this.flutterwaveService.getTransactionStatus(txRef);
    return { txRef, status };
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() payload: any,
    @Headers('verif-hash') verifHash: string,
  ) {
    // In production, verify the webhook signature
    // const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    // if (verifHash !== secretHash) {
    //   throw new UnauthorizedException('Invalid webhook signature');
    // }

    await this.flutterwaveService.handleWebhook(payload);
    return { message: 'Webhook processed' };
  }
}
