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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubscriptionsService = class SubscriptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSubscription(userId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        return subscription;
    }
    async updateSubscription(userId, updateDto) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        let maxUnits = 7;
        let amount = 75000;
        switch (updateDto.plan) {
            case 'STARTER':
                maxUnits = 7;
                amount = 75000;
                break;
            case 'PROFESSIONAL':
                maxUnits = 30;
                amount = 150000;
                break;
            case 'PREMIUM':
                maxUnits = 9999;
                amount = 300000;
                break;
        }
        const updated = await this.prisma.subscription.update({
            where: { userId },
            data: {
                plan: updateDto.plan,
                maxUnits,
                amount,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
        return updated;
    }
    async activateSubscription(userId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (subscription.status !== 'TRIAL') {
            throw new common_1.BadRequestException('Subscription is not in trial status');
        }
        const updated = await this.prisma.subscription.update({
            where: { userId },
            data: {
                status: 'ACTIVE',
            },
        });
        return updated;
    }
    async checkTrialExpiry(userId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
        });
        if (!subscription) {
            return { expired: false };
        }
        if (subscription.status === 'TRIAL' && subscription.trialEndsAt) {
            const now = new Date();
            const expired = now > subscription.trialEndsAt;
            if (expired && subscription.status === 'TRIAL') {
                await this.prisma.subscription.update({
                    where: { userId },
                    data: { status: 'EXPIRED' },
                });
            }
            const daysRemaining = Math.ceil((subscription.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return {
                expired,
                trialEndsAt: subscription.trialEndsAt,
                daysRemaining: Math.max(0, daysRemaining),
                isExpiringSoon: daysRemaining <= 7 && daysRemaining > 0,
            };
        }
        if (subscription.status === 'ACTIVE' && subscription.currentPeriodEnd) {
            const now = new Date();
            const expired = now > subscription.currentPeriodEnd;
            if (expired) {
                await this.prisma.subscription.update({
                    where: { userId },
                    data: { status: 'EXPIRED' },
                });
                return {
                    expired: true,
                    currentPeriodEnd: subscription.currentPeriodEnd,
                    daysRemaining: 0,
                    isExpiringSoon: false,
                };
            }
            const daysRemaining = Math.ceil((subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return {
                expired: false,
                currentPeriodEnd: subscription.currentPeriodEnd,
                daysRemaining: Math.max(0, daysRemaining),
                isExpiringSoon: daysRemaining <= 7 && daysRemaining > 0,
            };
        }
        return { expired: false };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map