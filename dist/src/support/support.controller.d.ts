import { SupportService } from './support.service';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    getUserMessages(user: any): Promise<({
        sender: {
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        replies: ({
            sender: {
                fullName: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isRead: boolean;
            senderId: string;
            receiverId: string | null;
            subject: string | null;
            content: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isRead: boolean;
        senderId: string;
        receiverId: string | null;
        subject: string | null;
        content: string;
        parentId: string | null;
    })[]>;
    sendMessage(user: any, content: string): Promise<{
        sender: {
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isRead: boolean;
        senderId: string;
        receiverId: string | null;
        subject: string | null;
        content: string;
        parentId: string | null;
    }>;
}
