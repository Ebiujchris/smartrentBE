import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { FlutterwaveService } from './flutterwave.service';
import { PaymentsFlutterwaveController } from './payments-flutterwave.controller';
import { PesapalService } from './pesapal.service';
import { PaymentsPesapalController } from './payments-pesapal.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController, PaymentsFlutterwaveController, PaymentsPesapalController],
  providers: [PaymentsService, FlutterwaveService, PesapalService],
  exports: [PaymentsService, FlutterwaveService, PesapalService],
})
export class PaymentsModule {}
