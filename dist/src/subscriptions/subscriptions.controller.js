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
exports.SubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const subscriptions_service_1 = require("./subscriptions.service");
const pesapal_service_1 = require("../payments/pesapal.service");
const update_subscription_dto_1 = require("./dto/update-subscription.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let SubscriptionsController = class SubscriptionsController {
    subscriptionsService;
    pesapalService;
    constructor(subscriptionsService, pesapalService) {
        this.subscriptionsService = subscriptionsService;
        this.pesapalService = pesapalService;
    }
    getSubscription(user) {
        return this.subscriptionsService.getSubscription(user.id);
    }
    updateSubscription(user, updateDto) {
        return this.subscriptionsService.updateSubscription(user.id, updateDto);
    }
    checkTrialExpiry(user) {
        return this.subscriptionsService.checkTrialExpiry(user.id);
    }
    async initiatePayment(user, dto) {
        const txRef = `SUB_${dto.planId}_${user.id}_${Date.now()}`;
        let planName = dto.planId;
        const paymentResponse = await this.pesapalService.initiatePayment({
            amount: dto.amount,
            phoneNumber: dto.phoneNumber,
            email: user.email,
            reference: txRef,
            description: `SmartRent Subscription - ${planName}`,
            metadata: {
                type: 'subscription',
                planId: dto.planId,
                buyerName: user.fullName || 'User',
            },
        });
        return {
            ...paymentResponse,
            txRef,
        };
    }
    async verifyAndPurchase(user, dto) {
        const verification = await this.pesapalService.verifyPayment(dto.orderTrackingId);
        if (!verification.success || verification.status !== 'successful') {
            return {
                success: false,
                message: 'Payment not confirmed. Please try again.',
                status: verification.status,
            };
        }
        await this.subscriptionsService.updateSubscription(user.id, { plan: dto.planId });
        await this.subscriptionsService.activateSubscriptionAfterPayment(user.id);
        return {
            success: true,
            message: 'Payment successful! Subscription renewed.',
        };
    }
};
exports.SubscriptionsController = SubscriptionsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "getSubscription", null);
__decorate([
    (0, common_1.Patch)(),
    (0, roles_decorator_1.Roles)('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_subscription_dto_1.UpdateSubscriptionDto]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Get)('trial-status'),
    (0, roles_decorator_1.Roles)('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "checkTrialExpiry", null);
__decorate([
    (0, common_1.Post)('initiate-payment'),
    (0, roles_decorator_1.Roles)('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "initiatePayment", null);
__decorate([
    (0, common_1.Post)('verify-and-purchase'),
    (0, roles_decorator_1.Roles)('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "verifyAndPurchase", null);
exports.SubscriptionsController = SubscriptionsController = __decorate([
    (0, common_1.Controller)('subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService,
        pesapal_service_1.PesapalService])
], SubscriptionsController);
//# sourceMappingURL=subscriptions.controller.js.map