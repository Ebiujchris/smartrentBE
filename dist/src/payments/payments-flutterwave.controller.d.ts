import { FlutterwaveService } from './flutterwave.service';
export declare class PaymentsFlutterwaveController {
    private readonly flutterwaveService;
    constructor(flutterwaveService: FlutterwaveService);
    initiatePayment(body: {
        amount: number;
        phoneNumber: string;
        email: string;
        network: 'MTN' | 'AIRTEL';
        reference: string;
        metadata?: any;
    }): Promise<import("./flutterwave.service").PaymentResponse>;
    verifyPayment(txRef: string): Promise<import("./flutterwave.service").PaymentResponse>;
    getStatus(txRef: string): Promise<{
        txRef: string;
        status: string;
    }>;
    handleWebhook(payload: any, verifHash: string): Promise<{
        message: string;
    }>;
}
