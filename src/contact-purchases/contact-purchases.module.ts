import { Module } from '@nestjs/common';
import { ContactPurchasesService } from './contact-purchases.service';
import { ContactPurchasesController } from './contact-purchases.controller';

@Module({
  providers: [ContactPurchasesService],
  controllers: [ContactPurchasesController]
})
export class ContactPurchasesModule {}
