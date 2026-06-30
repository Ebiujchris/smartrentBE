"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const properties_module_1 = require("./properties/properties.module");
const tenants_module_1 = require("./tenants/tenants.module");
const leases_module_1 = require("./leases/leases.module");
const payments_module_1 = require("./payments/payments.module");
const maintenance_module_1 = require("./maintenance/maintenance.module");
const notifications_module_1 = require("./notifications/notifications.module");
const reports_module_1 = require("./reports/reports.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const units_module_1 = require("./units/units.module");
const vacant_listings_module_1 = require("./vacant-listings/vacant-listings.module");
const support_module_1 = require("./support/support.module");
const contracts_module_1 = require("./contracts/contracts.module");
const contact_purchases_module_1 = require("./contact-purchases/contact-purchases.module");
const admin_module_1 = require("./admin/admin.module");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            properties_module_1.PropertiesModule,
            tenants_module_1.TenantsModule,
            leases_module_1.LeasesModule,
            payments_module_1.PaymentsModule,
            maintenance_module_1.MaintenanceModule,
            notifications_module_1.NotificationsModule,
            reports_module_1.ReportsModule,
            subscriptions_module_1.SubscriptionsModule,
            units_module_1.UnitsModule,
            vacant_listings_module_1.VacantListingsModule,
            support_module_1.SupportModule,
            contracts_module_1.ContractsModule,
            contact_purchases_module_1.ContactPurchasesModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map