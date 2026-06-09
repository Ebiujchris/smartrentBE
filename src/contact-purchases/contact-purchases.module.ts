import { Module } from '@nestjs/common';
import { ContactPurchasesService } from './contact-purchases.service';
import { ContactPurchasesController } from './contact-purchases.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PrismaModule, PaymentsModule],
  providers: [ContactPurchasesService],
  controllers: [ContactPurchasesController],
  exports: [ContactPurchasesService],
})
export class ContactPurchasesModule {}
