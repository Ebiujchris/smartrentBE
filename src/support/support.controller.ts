import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('messages')
  async getUserMessages(@CurrentUser() user: any) {
    return this.supportService.getUserMessages(user.id);
  }

  @Post('messages')
  async sendMessage(
    @CurrentUser() user: any,
    @Body('content') content: string,
  ) {
    return this.supportService.sendMessage(user.id, content);
  }
}
