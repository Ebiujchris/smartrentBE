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
    this.baseUrl = this.environment.toLowerCase() === 'live' 
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

      // Step 1: Get authentication token
      const token = await this.getAuthToken();

      // Step 2: Register IPN URL (if not already registered)
      const ipnId = await this.registerIPN(token);

      // Step 3: Submit order request
      const backendUrl = this.configService.get<string>('BACKEND_URL');
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      
      const orderPayload = {
        id: dto.reference,
        currency: 'UGX',
        amount: dto.amount,
        description: dto.description || 'Payment',
        callback_url: `${frontendUrl}/payment-callback`,
        notification_id: ipnId,
        billing_address: {
          email_address: dto.email,
          phone_number: formattedPhone,
          country_code: 'UG',
          first_name: dto.metadata?.buyerName?.split(' ')[0] || 'Customer',
          last_name: dto.metadata?.buyerName?.split(' ').slice(1).join(' ') || 'User',
        },
      };

      const orderResponse = await fetch(`${this.baseUrl}/Transactions/SubmitOrderRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok || orderResult.error) {
        throw new Error(orderResult.error?.message || 'Failed to create payment order');
      }

      const redirectUrl = orderResult.redirect_url;
      const orderTrackingId = orderResult.order_tracking_id;

      // Store transaction in database
      await this.prisma.pesapalTransaction.create({
        data: {
          txRef: dto.reference,
          orderTrackingId,
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

  private async getAuthToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: this.consumerKey,
        consumer_secret: this.consumerSecret,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error?.message || 'Failed to authenticate with Pesapal');
    }

    return result.token;
  }

  private async registerIPN(token: string): Promise<string> {
    const backendUrl = this.configService.get<string>('BACKEND_URL');
    const ipnUrl = `${backendUrl}/payments/pesapal/ipn`;

    // Check if IPN is already registered (you can store this in DB or config)
    const response = await fetch(`${this.baseUrl}/URLSetup/RegisterIPN`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: 'GET',
      }),
    });

    const result = await response.json();

    if (!response.ok && response.status !== 409) { // 409 means already registered
      this.logger.warn(`IPN registration response: ${JSON.stringify(result)}`);
    }

    // Return the IPN ID (if new) or use existing one
    return result.ipn_id || result.data?.ipn_id || '';
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

      // Get auth token
      const token = await this.getAuthToken();

      // Call Pesapal to check transaction status
      const response = await fetch(
        `${this.baseUrl}/Transactions/GetTransactionStatus?orderTrackingId=${transaction.orderTrackingId || orderTrackingId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to verify payment');
      }

      // Update transaction status based on Pesapal response
      const pesapalStatus = result.payment_status_description?.toLowerCase() || '';
      let status: 'pending' | 'successful' | 'failed' = 'pending';

      if (pesapalStatus.includes('completed') || pesapalStatus.includes('success')) {
        status = 'successful';
      } else if (pesapalStatus.includes('failed') || pesapalStatus.includes('invalid')) {
        status = 'failed';
      }

      // Update database
      await this.prisma.pesapalTransaction.update({
        where: { id: transaction.id },
        data: {
          status,
          verifiedAt: new Date(),
          paymentMethod: result.payment_method,
        },
      });

      return {
        success: status === 'successful',
        txRef: transaction.txRef,
        message: 'Payment status retrieved',
        status,
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
        // Verify the payment status with Pesapal API
        const verification = await this.verifyPayment(orderTrackingId);
        
        await this.prisma.pesapalTransaction.update({
          where: { id: transaction.id },
          data: {
            status: verification.status,
            ipnReceivedAt: new Date(),
          },
        });

        this.logger.log(`IPN processed: ${orderTrackingId} - Status: ${verification.status}`);
      }
    } catch (error) {
      this.logger.error(`IPN processing failed: ${error.message}`, error.stack);
    }
  }
}
