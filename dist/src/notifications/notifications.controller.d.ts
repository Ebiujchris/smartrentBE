import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(user: any): Promise<{
        id: string;
        title: string;
        message: string;
        type: string;
        read: boolean;
        createdAt: string;
    }[]>;
    markAsRead(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
    }>;
    markAllAsRead(user: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteNotification(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
    }>;
}
