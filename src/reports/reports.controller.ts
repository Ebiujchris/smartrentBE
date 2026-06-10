import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  async getOverview(@CurrentUser() user: any) {
    return this.reportsService.getOverview(user.id);
  }

  @Get('financial')
  async getFinancial(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getFinancial(user.id, startDate, endDate);
  }

  @Get('property')
  async getProperty(@CurrentUser() user: any) {
    return this.reportsService.getProperty(user.id);
  }

  @Get('tenant')
  async getTenant(@CurrentUser() user: any) {
    return this.reportsService.getTenant(user.id);
  }

  @Get('maintenance')
  async getMaintenance(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getMaintenance(user.id, startDate, endDate);
  }

  @Get('vacancy')
  async getVacancy(@CurrentUser() user: any) {
    return this.reportsService.getVacancy(user.id);
  }
}
