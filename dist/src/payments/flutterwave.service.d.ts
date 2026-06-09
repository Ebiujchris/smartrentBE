import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
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
export declare class FlutterwaveService {
    private configService;
    private prisma;
    private flw;
    private readonly logger;
    constructor(configService: ConfigService, prisma: PrismaService);
    initiateMobileMoneyPayment(dto: InitiatePaymentDto): Promise<PaymentResponse>;
    verifyPayment(txRef: string): Promise<PaymentResponse>;
    getTransactionStatus(txRef: string): Promise<string>;
    private mapFlutterwaveStatus;
    handleWebhook(payload: any): Promise<void>;
}
