import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('maintenance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN', 'TENANT')
  create(@CurrentUser() user: any, @Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenanceService.create(user.id, user, createMaintenanceDto);
  }

  @Get()
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN', 'TENANT')
  findAll(@CurrentUser() user: any) {
    return this.maintenanceService.findAll(user.id, user);
  }

  @Get(':id')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN', 'TENANT')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.maintenanceService.findOne(id, user);
  }

  @Patch(':id')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  update(@Param('id') id: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto, @CurrentUser() user: any) {
    return this.maintenanceService.update(id, updateMaintenanceDto, user);
  }

  @Post(':id/status')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
    @CurrentUser() user: any
  ) {
    return this.maintenanceService.updateStatus(id, body.status, body.notes, user);
  }

  @Delete(':id')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.maintenanceService.remove(id, user);
  }
}
