import { UserRole } from '@prisma/client';
export declare class UpdateUserDto {
    fullName?: string;
    phone?: string;
    role?: UserRole;
    isSuspended?: boolean;
}
