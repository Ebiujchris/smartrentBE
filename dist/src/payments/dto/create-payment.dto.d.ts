export declare class CreatePaymentDto {
    leaseId: string;
    tenantId: string;
    amount: number;
    dueDate: string;
    method?: string;
    reference?: string;
    notes?: string;
}
