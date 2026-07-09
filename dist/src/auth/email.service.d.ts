import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private resend;
    constructor(configService: ConfigService);
    sendPasswordResetEmail(email: string, token: string, fullName: string): Promise<void>;
}
