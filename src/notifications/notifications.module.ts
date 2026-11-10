import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RentRemindersController } from './rent-reminders.controller';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController, RentRemindersController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
