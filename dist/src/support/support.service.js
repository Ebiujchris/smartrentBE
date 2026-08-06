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
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SupportService = class SupportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserMessages(userId) {
        const messages = await this.prisma.supportMessage.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { parent: { senderId: userId } },
                    { receiverId: userId },
                ]
            },
            include: {
                sender: {
                    select: { id: true, fullName: true, role: true }
                },
                replies: {
                    include: {
                        sender: { select: { id: true, fullName: true, role: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        return messages;
    }
    async sendMessage(userId, content) {
        console.log(`[SUPPORT-DEBUG] sendMessage called with userId: ${userId}, content: ${content.substring(0, 50)}`);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { fullName: true, role: true, id: true },
        });
        if (!user) {
            console.error(`[SUPPORT-DEBUG] User not found: ${userId}`);
            throw new common_1.NotFoundException('User not found');
        }
        console.log(`[SUPPORT-DEBUG] User found: ${user.id} (${user.fullName}, role: ${user.role})`);
        const message = await this.prisma.supportMessage.create({
            data: {
                content,
                senderId: userId,
                subject: `Support request from ${user.fullName}`,
            },
            include: {
                sender: { select: { fullName: true, role: true, id: true } }
            }
        });
        console.log(`[SUPPORT-DEBUG] Message created with ID ${message.id}, sender: ${JSON.stringify(message.sender)}`);
        const adminUsers = await this.prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true },
        });
        for (const admin of adminUsers) {
            await this.prisma.notification.create({
                data: {
                    userId: admin.id,
                    title: `New Support Ticket`,
                    message: `${user.fullName} sent a new support message.`,
                    type: 'INFO',
                },
            });
        }
        return message;
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupportService);
//# sourceMappingURL=support.service.js.map