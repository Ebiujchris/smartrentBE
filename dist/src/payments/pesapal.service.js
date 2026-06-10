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
        this.consumerKey = this.configService.get('PESAPAL_CONSUMER_KEY');
        this.consumerSecret = this.configService.get('PESAPAL_CONSUMER_SECRET');
        this.environment = this.configService.get('PESAPAL_ENVIRONMENT') || 'sandbox';
        this.baseUrl = this.environment === 'live'
            ? 'https://pay.pesapal.com/v3/api'
            : 'https://cybqa.pesapal.com/pesapalv3/api';
        if (!this.consumerKey || !this.consumerSecret) {
            this.logger.warn('Pesapal keys not configured. Payment features will be disabled.');
        }
        else {
            this.logger.log(`Pesapal service initialized in ${this.environment} mode`);
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
            const redirectUrl = `https://www.pesapal.com/payment?amount=${dto.amount}&ref=${dto.reference}`;
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
    async verifyPayment(orderTrackingId) {
        try {
            this.logger.log(`Verifying payment: ${orderTrackingId}`);
            const transaction = await this.prisma.pesapalTransaction.findFirst({
                where: { OR: [{ orderTrackingId }, { txRef: orderTrackingId }] },
            });
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            return {
                success: transaction.status === 'successful',
                txRef: transaction.txRef,
                message: 'Payment status retrieved',
                status: transaction.status,
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
                await this.prisma.pesapalTransaction.update({
                    where: { id: transaction.id },
                    data: {
                        status: 'successful',
                        ipnReceivedAt: new Date(),
                    },
                });
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