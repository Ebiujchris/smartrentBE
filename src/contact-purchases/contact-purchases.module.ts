import { Module } from '@nestjs/common';
import { ContactPurchasesService } from './contact-purchases.service';
import { ContactPurchasesController } from './contact-purchases.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ContactPurchasesService],
  controllers: [ContactPurchasesController],
  exports: [ContactPurchasesService],
})
export class ContactPurchasesModule {}
