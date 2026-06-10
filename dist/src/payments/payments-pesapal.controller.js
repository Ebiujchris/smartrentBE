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
exports.PaymentsPesapalController = void 0;
const common_1 = require("@nestjs/common");
const pesapal_service_1 = require("./pesapal.service");
let PaymentsPesapalController = class PaymentsPesapalController {
    pesapalService;
    constructor(pesapalService) {
        this.pesapalService = pesapalService;
    }
    async initiatePayment(body) {
        return this.pesapalService.initiatePayment(body);
    }
    async verifyPayment(orderTrackingId) {
        return this.pesapalService.verifyPayment(orderTrackingId);
    }
    async getStatus(txRef) {
        const status = await this.pesapalService.getTransactionStatus(txRef);
        return { txRef, status };
    }
    async handleIPN(orderTrackingId, merchantReference) {
        await this.pesapalService.handleIPN(orderTrackingId);
        return { message: 'IPN processed' };
    }
};
exports.PaymentsPesapalController = PaymentsPesapalController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsPesapalController.prototype, "initiatePayment", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('orderTrackingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsPesapalController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Query)('txRef')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsPesapalController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('ipn'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('OrderTrackingId')),
    __param(1, (0, common_1.Query)('OrderMerchantReference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentsPesapalController.prototype, "handleIPN", null);
exports.PaymentsPesapalController = PaymentsPesapalController = __decorate([
    (0, common_1.Controller)('payments/pesapal'),
    __metadata("design:paramtypes", [pesapal_service_1.PesapalService])
], PaymentsPesapalController);
//# sourceMappingURL=payments-pesapal.controller.js.map