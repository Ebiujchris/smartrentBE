import { PrismaService } from '../prisma/prisma.service';
export declare class SupportService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserMessages(userId: string): Promise<never[]>;
    sendMessage(userId: string, content: string): Promise<{
        id: string;
        content: string;
        senderId: string;
        senderName: string;
        senderRole: import("@prisma/client").$Enums.UserRole;
        createdAt: string;
        isOwn: boolean;
    }>;
}
