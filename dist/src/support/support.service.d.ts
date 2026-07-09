import { PrismaService } from '../prisma/prisma.service';
export declare class SupportService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserMessages(userId: string): Promise<({
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
            subject: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isRead: boolean;
            senderId: string;
            receiverId: string | null;
            content: string;
            parentId: string | null;
        })[];
    } & {
        subject: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isRead: boolean;
        senderId: string;
        receiverId: string | null;
        content: string;
        parentId: string | null;
    })[]>;
    sendMessage(userId: string, content: string): Promise<{
        sender: {
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        subject: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isRead: boolean;
        senderId: string;
        receiverId: string | null;
        content: string;
        parentId: string | null;
    }>;
}
