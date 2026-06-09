import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  async getOverview(@Request() req) {
    return this.reportsService.getOverviewReport(req.user.id);
  }

  @Get('financial')
  async getFinancial(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.getFinancialReport(req.user.id, start, end);
  }

  @Get('property')
  async getProperty(@Request() req) {
    return this.reportsService.getPropertyReport(req.user.id);
  }

  @Get('tenant')
  async getTenant(@Request() req) {
    return this.reportsService.getTenantReport(req.user.id);
  }

  @Get('maintenance')
  async getMaintenance(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.getMaintenanceReport(req.user.id, start, end);
  }

  @Get('vacancy')
  async getVacancy(@Request() req) {
    return this.reportsService.getVacancyReport(req.user.id);
  }
}
