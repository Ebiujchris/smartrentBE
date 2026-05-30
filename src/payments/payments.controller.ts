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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

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
