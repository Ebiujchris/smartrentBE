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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactPurchasesController = void 0;
const common_1 = require("@nestjs/common");
const contact_purchases_service_1 = require("./contact-purchases.service");
const flutterwave_service_1 = require("../payments/flutterwave.service");
let ContactPurchasesController = class ContactPurchasesController {
    service;
    flutterwaveService;
    constructor(service, flutterwaveService) {
        this.service = service;
        this.flutterwaveService = flutterwaveService;
    }
    async checkPurchase(dto) {
        const hasPurchased = await this.service.hasPurchased(dto.listingId, dto.buyerPhone);
        return { hasPurchased };
    }
    async initiatePayment(dto) {
        const alreadyPurchased = await this.service.hasPurchased(dto.listingId, dto.buyerPhone);
        if (alreadyPurchased) {
            return {
                success: false,
                message: 'You have already purchased this contact',
            };
        }
        const txRef = `CONTACT_${dto.listingId}_${Date.now()}`;
        const paymentResponse = await this.flutterwaveService.initiateMobileMoneyPayment({
            amount: 10000,
            phoneNumber: dto.buyerPhone,
            email: dto.buyerEmail || 'customer@smartrentug.com',
            network: dto.paymentMethod,
            reference: txRef,
            metadata: {
                type: 'contact_purchase',
                listingId: dto.listingId,
                buyerName: dto.buyerName,
            },
        });
        return {
            ...paymentResponse,
            txRef,
        };
    }
    async verifyAndPurchase(dto) {
        const verification = await this.flutterwaveService.verifyPayment(dto.txRef);
        if (!verification.success || verification.status !== 'successful') {
            return {
                success: false,
                message: 'Payment not confirmed. Please try again.',
                status: verification.status,
            };
        }
        const purchase = await this.service.createPurchase({
            listingId: dto.listingId,
            buyerPhone: dto.buyerPhone,
            buyerEmail: dto.buyerEmail,
            buyerName: dto.buyerName,
            paymentMethod: dto.paymentMethod,
            transactionId: dto.txRef,
        });
        const contact = await this.service.getContactInfo(dto.listingId, dto.buyerPhone);
        return {
            success: true,
            message: 'Payment successful! Contact revealed.',
            contact,
            purchase,
        };
    }
    async createPurchase(dto) {
        return this.service.createPurchase(dto);
    }
    async getContact(listingId, buyerPhone) {
        return this.service.getContactInfo(listingId, buyerPhone);
    }
    async getAllPurchases() {
        return this.service.getAllPurchases();
    }
};
exports.ContactPurchasesController = ContactPurchasesController;
__decorate([
    (0, common_1.Post)('check'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactPurchasesController.prototype, "checkPurchase", null);
__decorate([
    (0, common_1.Post)('initiate-payment'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactPurchasesController.prototype, "initiatePayment", null);
__decorate([
    (0, common_1.Post)('verify-and-purchase'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactPurchasesController.prototype, "verifyAndPurchase", null);
__decorate([
    (0, common_1.Post)('purchase'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactPurchasesController.prototype, "createPurchase", null);
__decorate([
    (0, common_1.Get)('contact'),
    __param(0, (0, common_1.Query)('listingId')),
    __param(1, (0, common_1.Query)('buyerPhone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactPurchasesController.prototype, "getContact", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactPurchasesController.prototype, "getAllPurchases", null);
exports.ContactPurchasesController = ContactPurchasesController = __decorate([
    (0, common_1.Controller)('contact-purchases'),
    __metadata("design:paramtypes", [contact_purchases_service_1.ContactPurchasesService,
        flutterwave_service_1.FlutterwaveService])
], ContactPurchasesController);
//# sourceMappingURL=contact-purchases.controller.js.map