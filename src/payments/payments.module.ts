import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { FlutterwaveService } from './flutterwave.service';
import { PaymentsFlutterwaveController } from './payments-flutterwave.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController, PaymentsFlutterwaveController],
  providers: [PaymentsService, FlutterwaveService],
  exports: [PaymentsService, FlutterwaveService],
})
export class PaymentsModule {}
