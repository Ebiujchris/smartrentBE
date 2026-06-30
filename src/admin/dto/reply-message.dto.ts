import { IsString, IsOptional, MinLength } from 'class-validator';

export class ReplyMessageDto {
  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @IsString()
  subject?: string;
}
