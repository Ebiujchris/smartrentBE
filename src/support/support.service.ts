import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async getUserMessages(userId: string) {
    return this.prisma.supportMessage.findMany({
      where: {
        OR: [
          { senderId: userId },
          // Include replies to messages where user is the sender
          { parent: { senderId: userId } }
        ]
      },
      include: {
        sender: {
          select: { fullName: true, role: true }
        },
        replies: {
          include: {
            sender: { select: { fullName: true, role: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendMessage(userId: string, content: string) {
    console.log(`[SUPPORT-DEBUG] sendMessage called with userId: ${userId}, content: ${content.substring(0, 50)}`);
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, role: true, id: true },
    });

    if (!user) {
      console.error(`[SUPPORT-DEBUG] User not found: ${userId}`);
      throw new NotFoundException('User not found');
    }

    console.log(`[SUPPORT-DEBUG] User found: ${user.id} (${user.fullName}, role: ${user.role})`);

    // Create the actual support message
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

    // Optionally notify admins
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
}
