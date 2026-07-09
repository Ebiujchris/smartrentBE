import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserNotifications(userId: string): Promise<{
        id: string;
        title: string;
        message: string;
        type: string;
        read: boolean;
        createdAt: string;
    }[]>;
    markAsRead(notificationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteNotification(notificationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
    }>;
    createNotification(userId: string, title: string, message: string, type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
    }>;
}
