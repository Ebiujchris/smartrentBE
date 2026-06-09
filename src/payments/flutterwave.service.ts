import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

const Flutterwave = require('flutterwave-node-v3');

export interface InitiatePaymentDto {
  amount: number;
  phoneNumber: string;
  email: string;
  network: 'MTN' | 'AIRTEL';
  reference: string;
  metadata?: any;
}

export interface PaymentResponse {
  success: boolean;
  txRef: string;
  flwRef?: string;
  message: string;
  status: 'pending' | 'successful' | 'failed';
}

@Injectable()
export class FlutterwaveService {
  private flw: any;
  private readonly logger = new Logger(FlutterwaveService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const publicKey = this.configService.get<string>('FLUTTERWAVE_PUBLIC_KEY');
    const secretKey = this.configService.get<string>('FLUTTERWAVE_SECRET_KEY');

    if (!publicKey || !secretKey) {
      this.logger.warn('Flutterwave keys not configured. Payment features will be disabled.');
    } else {
      this.flw = new Flutterwave(publicKey, secretKey);
      this.logger.log('Flutterwave service initialized');
    }
  }

  async initiateMobileMoneyPayment(dto: InitiatePaymentDto): Promise<PaymentResponse> {
    try {
      if (!this.flw) {
        throw new Error('Flutterwave not configured');
      }

      // Format phone number (ensure it starts with 256)
      let formattedPhone = dto.phoneNumber.replace(/\s+/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '256' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('256')) {
        formattedPhone = '256' + formattedPhone;
      }

      const payload = {
        tx_ref: dto.reference,
        amount: dto.amount,
        currency: 'UGX',
        network: dto.network,
        phone_number: formattedPhone,
        email: dto.email,
        fullname: dto.metadata?.name || 'Customer',
        client_ip: '127.0.0.1',
        device_fingerprint: dto.reference,
        meta: dto.metadata || {},
      };

      this.logger.log(`Initiating ${dto.network} payment: ${dto.reference}`);
      
      const response = await this.flw.MobileMoney.uganda(payload);

      this.logger.log(`Flutterwave response: ${JSON.stringify(response)}`);

      // Store transaction in database
      await this.prisma.flutterwaveTransaction.create({
        data: {
          txRef: dto.reference,
          flwRef: response.data?.flw_ref || response.data?.tx_ref,
          amount: dto.amount,
          phoneNumber: formattedPhone,
          email: dto.email,
          network: dto.network,
          status: response.data?.status || 'pending',
          metadata: dto.metadata || {},
        },
      });

      return {
        success: response.status === 'success',
        txRef: dto.reference,
        flwRef: response.data?.flw_ref || response.data?.tx_ref,
        message: response.message || 'Payment initiated. Please check your phone to complete.',
        status: this.mapFlutterwaveStatus(response.data?.status),
      };
    } catch (error) {
      this.logger.error(`Payment initiation failed: ${error.message}`, error.stack);
      
      // Store failed transaction
      await this.prisma.flutterwaveTransaction.create({
        data: {
          txRef: dto.reference,
          amount: dto.amount,
          phoneNumber: dto.phoneNumber,
          email: dto.email,
          network: dto.network,
          status: 'failed',
          metadata: dto.metadata || {},
          errorMessage: error.message,
        },
      });

      return {
        success: false,
        txRef: dto.reference,
        message: error.message || 'Payment initiation failed',
        status: 'failed',
      };
    }
  }

  async verifyPayment(txRef: string): Promise<PaymentResponse> {
    try {
      if (!this.flw) {
        throw new Error('Flutterwave not configured');
      }

      this.logger.log(`Verifying payment: ${txRef}`);
      
      const response = await this.flw.Transaction.verify({ id: txRef });

      this.logger.log(`Verification response: ${JSON.stringify(response)}`);

      // Update transaction in database
      const transaction = await this.prisma.flutterwaveTransaction.findFirst({
        where: { txRef },
      });

      if (transaction) {
        await this.prisma.flutterwaveTransaction.update({
          where: { id: transaction.id },
          data: {
            status: response.data?.status || 'failed',
            flwRef: response.data?.flw_ref || transaction.flwRef,
            verifiedAt: new Date(),
          },
        });
      }

      return {
        success: response.status === 'success' && response.data?.status === 'successful',
        txRef,
        flwRef: response.data?.flw_ref,
        message: response.message || 'Payment verified',
        status: this.mapFlutterwaveStatus(response.data?.status),
      };
    } catch (error) {
      this.logger.error(`Payment verification failed: ${error.message}`, error.stack);
      
      return {
        success: false,
        txRef,
        message: error.message || 'Verification failed',
        status: 'failed',
      };
    }
  }

  async getTransactionStatus(txRef: string): Promise<string> {
    const transaction = await this.prisma.flutterwaveTransaction.findFirst({
      where: { txRef },
      orderBy: { createdAt: 'desc' },
    });

    return transaction?.status || 'unknown';
  }

  private mapFlutterwaveStatus(status: string): 'pending' | 'successful' | 'failed' {
    if (!status) return 'pending';
    
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'successful' || statusLower === 'success') {
      return 'successful';
    } else if (statusLower === 'failed' || statusLower === 'error') {
      return 'failed';
    } else {
      return 'pending';
    }
  }

  // Webhook handler
  async handleWebhook(payload: any): Promise<void> {
    try {
      this.logger.log(`Webhook received: ${JSON.stringify(payload)}`);

      const txRef = payload.data?.tx_ref;
      const status = payload.data?.status;
      const flwRef = payload.data?.flw_ref;

      if (!txRef) {
        this.logger.warn('Webhook missing tx_ref');
        return;
      }

      // Update transaction
      const transaction = await this.prisma.flutterwaveTransaction.findFirst({
        where: { txRef },
      });

      if (transaction) {
        await this.prisma.flutterwaveTransaction.update({
          where: { id: transaction.id },
          data: {
            status: status || 'failed',
            flwRef: flwRef || transaction.flwRef,
            webhookReceivedAt: new Date(),
          },
        });

        this.logger.log(`Transaction ${txRef} updated to ${status}`);
      } else {
        this.logger.warn(`Transaction ${txRef} not found in database`);
      }
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`, error.stack);
    }
  }
}
