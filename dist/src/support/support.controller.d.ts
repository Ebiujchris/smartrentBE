import { SupportService } from './support.service';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    getUserMessages(user: any): Promise<never[]>;
    sendMessage(user: any, content: string): Promise<{
        id: string;
        content: string;
        senderId: string;
        senderName: string;
        senderRole: import("@prisma/client").$Enums.UserRole;
        createdAt: string;
        isOwn: boolean;
    }>;
}
