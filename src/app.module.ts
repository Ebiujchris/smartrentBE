import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { TenantsModule } from './tenants/tenants.module';
import { LeasesModule } from './leases/leases.module';
import { PaymentsModule } from './payments/payments.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UnitsModule } from './units/units.module';
import { VacantListingsModule } from './vacant-listings/vacant-listings.module';
import { SupportModule } from './support/support.module';
import { ContractsModule } from './contracts/contracts.module';
import { ContactPurchasesModule } from './contact-purchases/contact-purchases.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    TenantsModule,
    LeasesModule,
    PaymentsModule,
    MaintenanceModule,
    NotificationsModule,
    ReportsModule,
    SubscriptionsModule,
    UnitsModule,
    VacantListingsModule,
    SupportModule,
    ContractsModule,
    ContactPurchasesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
