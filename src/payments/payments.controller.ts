import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Get('debug-env')
  getDebugEnv() {
    return {
      env: this.configService.get<string>('PESAPAL_ENVIRONMENT'),
      hasKey: !!this.configService.get<string>('PESAPAL_CONSUMER_KEY'),
      hasSecret: !!this.configService.get<string>('PESAPAL_CONSUMER_SECRET'),
      nodeEnv: process.env.NODE_ENV,
    };
  }

  @Post()
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  create(@CurrentUser() user: any, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(user.id, createPaymentDto);
  }

  @Get()
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN', 'TENANT')
  findAll(@CurrentUser() user: any) {
    return this.paymentsService.findAll(user.id);
  }

  @Get('overdue')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  getOverdue(@CurrentUser() user: any) {
    return this.paymentsService.getOverduePayments(user.id);
  }

  @Get('tenant/:tenantId')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.paymentsService.findByTenantId(tenantId);
  }

  @Get(':id')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN', 'TENANT')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Post('fix-dates')
  @Roles('ADMIN')
  async fixPaymentDates() {
    const paymentsToFix = await this.prisma.payment.findMany({
      where: {
        status: 'PAID',
        paidDate: null,
      },
    });

    for (const payment of paymentsToFix) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          paidDate: payment.createdAt || new Date(),
        },
      });
    }

    return {
      message: `Fixed ${paymentsToFix.length} payments with null paidDate`,
      count: paymentsToFix.length,
    };
  }

  @Post(':id/record')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  recordPayment(
    @Param('id') id: string,
    @Body() body: { method: string; reference?: string; notes?: string },
  ) {
    return this.paymentsService.recordPayment(
      id,
      body.method,
      body.reference,
      body.notes,
    );
  }

  @Delete(':id')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
