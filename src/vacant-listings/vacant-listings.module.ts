import { Module } from '@nestjs/common';
import { VacantListingsController } from './vacant-listings.controller';
import { VacantListingsService } from './vacant-listings.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VacantListingsController],
  providers: [VacantListingsService],
  exports: [VacantListingsService],
})
export class VacantListingsModule {}
