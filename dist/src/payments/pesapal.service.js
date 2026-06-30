"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PesapalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PesapalService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let PesapalService = PesapalService_1 = class PesapalService {
    configService;
    prisma;
    logger = new common_1.Logger(PesapalService_1.name);
    consumerKey;
    consumerSecret;
    environment;
    baseUrl;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.consumerKey = this.configService.get('PESAPAL_CONSUMER_KEY') || process.env.PESAPAL_CONSUMER_KEY;
        this.consumerSecret = this.configService.get('PESAPAL_CONSUMER_SECRET') || process.env.PESAPAL_CONSUMER_SECRET;
        this.environment = this.configService.get('PESAPAL_ENVIRONMENT') || process.env.PESAPAL_ENVIRONMENT || 'sandbox';
        this.baseUrl = this.environment.toLowerCase().trim() === 'live'
            ? 'https://pay.pesapal.com/v3/api'
            : 'https://cybqa.pesapal.com/pesapalv3/api';
        if (!this.consumerKey || !this.consumerSecret) {
            this.logger.warn('Pesapal keys not configured. Payment features will be disabled.');
        }
        else {
            this.logger.warn(`Pesapal initialized: env=${this.environment}, baseUrl=${this.baseUrl}, keyLen=${this.consumerKey?.length}`);
        }
    }
    async initiatePayment(dto) {
        try {
            if (!this.consumerKey || !this.consumerSecret) {
                throw new Error('Pesapal not configured');
            }
            let formattedPhone = dto.phoneNumber.replace(/\s+/g, '');
            if (formattedPhone.startsWith('0')) {
                formattedPhone = '256' + formattedPhone.substring(1);
            }
            else if (!formattedPhone.startsWith('256')) {
                formattedPhone = '256' + formattedPhone;
            }
            this.logger.log(`Initiating Pesapal payment: ${dto.reference}`);
            const token = await this.getAuthToken();
            const ipnId = await this.registerIPN(token);
            const backendUrl = this.configService.get('BACKEND_URL');
            const frontendUrl = this.configService.get('FRONTEND_URL');
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
        }
        catch (error) {
            this.logger.error(`Payment initiation failed: ${error.message}`, error.stack);
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
    async getAuthToken() {
        const authUrl = `${this.baseUrl}/Auth/RequestToken`;
        this.logger.warn(`Pesapal auth attempt: URL=${authUrl}, env=${this.environment}, hasKey=${!!this.consumerKey}, hasSecret=${!!this.consumerSecret}`);
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                consumer_key: this.consumerKey,
                consumer_secret: this.consumerSecret,
            }),
        });
        const result = await response.json();
        if (!response.ok || result.error) {
            const diagMsg = `Pesapal auth FAILED: status=${response.status}, url=${authUrl}, errorCode=${result.error?.code}, env=${this.environment}, keyLen=${this.consumerKey?.length || 0}`;
            this.logger.error(diagMsg);
            throw new Error(diagMsg);
        }
        this.logger.warn('Pesapal auth SUCCESS - token acquired');
        return result.token;
    }
    async registerIPN(token) {
        const backendUrl = this.configService.get('BACKEND_URL');
        const ipnUrl = `${backendUrl}/payments/pesapal/ipn`;
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
        if (!response.ok && response.status !== 409) {
            this.logger.warn(`IPN registration response: ${JSON.stringify(result)}`);
        }
        return result.ipn_id || result.data?.ipn_id || '';
    }
    async verifyPayment(orderTrackingId) {
        try {
            this.logger.log(`Verifying payment: ${orderTrackingId}`);
            const transaction = await this.prisma.pesapalTransaction.findFirst({
                where: { OR: [{ orderTrackingId }, { txRef: orderTrackingId }] },
            });
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            const token = await this.getAuthToken();
            const response = await fetch(`${this.baseUrl}/Transactions/GetTransactionStatus?orderTrackingId=${transaction.orderTrackingId || orderTrackingId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error?.message || 'Failed to verify payment');
            }
            const pesapalStatus = result.payment_status_description?.toLowerCase() || '';
            let status = 'pending';
            if (pesapalStatus.includes('completed') || pesapalStatus.includes('success')) {
                status = 'successful';
            }
            else if (pesapalStatus.includes('failed') || pesapalStatus.includes('invalid')) {
                status = 'failed';
            }
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
        }
        catch (error) {
            this.logger.error(`Payment verification failed: ${error.message}`, error.stack);
            return {
                success: false,
                txRef: orderTrackingId,
                message: error.message || 'Verification failed',
                status: 'failed',
            };
        }
    }
    async getTransactionStatus(txRef) {
        const transaction = await this.prisma.pesapalTransaction.findFirst({
            where: { txRef },
            orderBy: { createdAt: 'desc' },
        });
        return transaction?.status || 'unknown';
    }
    async handleIPN(orderTrackingId) {
        try {
            this.logger.log(`IPN received for: ${orderTrackingId}`);
            const transaction = await this.prisma.pesapalTransaction.findFirst({
                where: { orderTrackingId },
            });
            if (transaction) {
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
        }
        catch (error) {
            this.logger.error(`IPN processing failed: ${error.message}`, error.stack);
        }
    }
};
exports.PesapalService = PesapalService;
exports.PesapalService = PesapalService = PesapalService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PesapalService);
//# sourceMappingURL=pesapal.service.js.map