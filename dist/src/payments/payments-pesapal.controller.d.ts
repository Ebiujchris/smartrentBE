import { PesapalService } from './pesapal.service';
export declare class PaymentsPesapalController {
    private readonly pesapalService;
    constructor(pesapalService: PesapalService);
    initiatePayment(body: {
        amount: number;
        phoneNumber: string;
        email: string;
        reference: string;
        description?: string;
        metadata?: any;
    }): Promise<import("./pesapal.service").PaymentResponse>;
    verifyPayment(orderTrackingId: string): Promise<import("./pesapal.service").PaymentResponse>;
    getStatus(txRef: string): Promise<{
        txRef: string;
        status: string;
    }>;
    handleIPN(orderTrackingId: string, merchantReference: string): Promise<{
        message: string;
    }>;
}
