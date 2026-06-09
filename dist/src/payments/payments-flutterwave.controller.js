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
exports.PaymentsFlutterwaveController = void 0;
const common_1 = require("@nestjs/common");
const flutterwave_service_1 = require("./flutterwave.service");
let PaymentsFlutterwaveController = class PaymentsFlutterwaveController {
    flutterwaveService;
    constructor(flutterwaveService) {
        this.flutterwaveService = flutterwaveService;
    }
    async initiatePayment(body) {
        return this.flutterwaveService.initiateMobileMoneyPayment(body);
    }
    async verifyPayment(txRef) {
        return this.flutterwaveService.verifyPayment(txRef);
    }
    async getStatus(txRef) {
        const status = await this.flutterwaveService.getTransactionStatus(txRef);
        return { txRef, status };
    }
    async handleWebhook(payload, verifHash) {
        await this.flutterwaveService.handleWebhook(payload);
        return { message: 'Webhook processed' };
    }
};
exports.PaymentsFlutterwaveController = PaymentsFlutterwaveController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsFlutterwaveController.prototype, "initiatePayment", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('txRef')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsFlutterwaveController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Query)('txRef')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsFlutterwaveController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('verif-hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsFlutterwaveController.prototype, "handleWebhook", null);
exports.PaymentsFlutterwaveController = PaymentsFlutterwaveController = __decorate([
    (0, common_1.Controller)('payments/flutterwave'),
    __metadata("design:paramtypes", [flutterwave_service_1.FlutterwaveService])
], PaymentsFlutterwaveController);
//# sourceMappingURL=payments-flutterwave.controller.js.map