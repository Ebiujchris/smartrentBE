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
export declare class PesapalService {
    private configService;
    private prisma;
    private readonly logger;
    private consumerKey;
    private consumerSecret;
    private environment;
    private baseUrl;
    constructor(configService: ConfigService, prisma: PrismaService);
    initiatePayment(dto: InitiatePaymentDto): Promise<PaymentResponse>;
    verifyPayment(orderTrackingId: string): Promise<PaymentResponse>;
    getTransactionStatus(txRef: string): Promise<string>;
    handleIPN(orderTrackingId: string): Promise<void>;
}
