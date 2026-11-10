import {
  Controller,
  Get,
  Headers,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';

@Controller('cron')
export class RentRemindersController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {}

  @Get('rent-reminders')
  dispatchRentReminders(@Headers('authorization') authorization?: string) {
    const secret = this.configService.get<string>('CRON_SECRET');
    if (!secret) {
      throw new ServiceUnavailableException('CRON_SECRET is not configured');
    }
    if (authorization !== `Bearer ${secret}`) {
      throw new UnauthorizedException('Invalid cron authorization');
    }
    return this.notificationsService.dispatchRentReminders();
  }
}
