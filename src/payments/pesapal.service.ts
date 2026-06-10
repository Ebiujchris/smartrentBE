import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

export interface InitiatePaymentDto {
  amount: number;
  phoneNumber: string;
  email: string;
  reference: string;
  description?: string;
  metadata?: any;
}

export interface PaymentResponse {
  success: boolean;
  txRef: string;
  redirectUrl?: string;
  message: string;
  status: 'pending' | 'successful' | 'failed';
}

@Injectable()
export class PesapalService {
  private readonly logger = new Logger(PesapalService.name);
  private consumerKey: string | undefined;
  private consumerSecret: string | undefined;
  private environment: string;
  private baseUrl: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.consumerKey = this.configService.get<string>('PESAPAL_CONSUMER_KEY');
    this.consumerSecret = this.configService.get<string>('PESAPAL_CONSUMER_SECRET');
    this.environment = this.configService.get<string>('PESAPAL_ENVIRONMENT') || 'sandbox';
    this.baseUrl = this.environment === 'live' 
      ? 'https://pay.pesapal.com/v3/api' 
      : 'https://cybqa.pesapal.com/pesapalv3/api';

    if (!this.consumerKey || !this.consumerSecret) {
      this.logger.warn('Pesapal keys not configured. Payment features will be disabled.');
    } else {
      this.logger.log(`Pesapal service initialized in ${this.environment} mode`);
    }
  }

  async initiatePayment(dto: InitiatePaymentDto): Promise<PaymentResponse> {
    try {
      if (!this.consumerKey || !this.consumerSecret) {
        throw new Error('Pesapal not configured');
      }

      // Format phone number
      let formattedPhone = dto.phoneNumber.replace(/\s+/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '256' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('256')) {
        formattedPhone = '256' + formattedPhone;
      }

      this.logger.log(`Initiating Pesapal payment: ${dto.reference}`);

      // For now, create a simple redirect URL approach
      // In production, you would make actual API calls to Pesapal
      const redirectUrl = `https://www.pesapal.com/payment?amount=${dto.amount}&ref=${dto.reference}`;

      // Store transaction in database
      await this.prisma.pesapalTransaction.create({
        data: {
          txRef: dto.reference,
          amount: dto.amount,
          phoneNumber: formattedPhone,
          email: dto.email,
          status: 'pending',
          redirectUrl,
          metadata: dto.metadata || {},
        },
      });

      return {
        success: true,
        txRef: dto.reference,
        redirectUrl,
        message: 'Payment initiated. Redirect user to complete payment.',
        status: 'pending',
      };
    } catch (error) {
      this.logger.error(`Payment initiation failed: ${error.message}`, error.stack);

      // Store failed transaction
      await this.prisma.pesapalTransaction.create({
        data: {
          txRef: dto.reference,
          amount: dto.amount,
          phoneNumber: dto.phoneNumber,
          email: dto.email,
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

  async verifyPayment(orderTrackingId: string): Promise<PaymentResponse> {
    try {
      this.logger.log(`Verifying payment: ${orderTrackingId}`);

      // Get transaction from database
      const transaction = await this.prisma.pesapalTransaction.findFirst({
        where: { OR: [{ orderTrackingId }, { txRef: orderTrackingId }] },
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // For now, return the current status
      // In production, you would call Pesapal API to verify
      return {
        success: transaction.status === 'successful',
        txRef: transaction.txRef,
        message: 'Payment status retrieved',
        status: transaction.status as 'pending' | 'successful' | 'failed',
      };
    } catch (error) {
      this.logger.error(`Payment verification failed: ${error.message}`, error.stack);

      return {
        success: false,
        txRef: orderTrackingId,
        message: error.message || 'Verification failed',
        status: 'failed',
      };
    }
  }

  async getTransactionStatus(txRef: string): Promise<string> {
    const transaction = await this.prisma.pesapalTransaction.findFirst({
      where: { txRef },
      orderBy: { createdAt: 'desc' },
    });

    return transaction?.status || 'unknown';
  }

  // Handle IPN (webhook) callback
  async handleIPN(orderTrackingId: string): Promise<void> {
    try {
      this.logger.log(`IPN received for: ${orderTrackingId}`);

      const transaction = await this.prisma.pesapalTransaction.findFirst({
        where: { orderTrackingId },
      });

      if (transaction) {
        await this.prisma.pesapalTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'successful',
            ipnReceivedAt: new Date(),
          },
        });
      }
    } catch (error) {
      this.logger.error(`IPN processing failed: ${error.message}`, error.stack);
    }
  }
}
