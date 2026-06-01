import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async getUserMessages(userId: string) {
    // For now, we'll store support messages in a simple way
    // In production, you might want a dedicated SupportMessage model
    // For this implementation, we'll use the Notification model temporarily
    // or create a new model in the future
    
    // Return empty array for now - you can implement proper message storage
    return [];
  }

  async sendMessage(userId: string, content: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // For now, create a notification to admin about the support message
    // In production, implement proper support ticket/message system
    const adminUsers = await this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    // Notify all admins
    for (const admin of adminUsers) {
      await this.prisma.notification.create({
        data: {
          userId: admin.id,
          title: `Support Message from ${user.fullName}`,
          message: content,
          type: 'INFO',
        },
      });
    }

    // Return the message as if it was sent
    return {
      id: Date.now().toString(),
      content,
      senderId: userId,
      senderName: user.fullName,
      senderRole: user.role,
      createdAt: new Date().toISOString(),
      isOwn: true,
    };
  }
}
