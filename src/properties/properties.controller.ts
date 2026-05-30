import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LANDLORD, UserRole.PROPERTY_MANAGER, UserRole.ADMIN)
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.propertiesService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.findOne(id, user.id);
  }

  @Post()
  async create(@Body() data: any, @CurrentUser() user: any) {
    return this.propertiesService.create(data, user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: any) {
    return this.propertiesService.update(id, data, user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.remove(id, user.id);
  }

  @Get(':id/units')
  async getUnits(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.getUnits(id, user.id);
  }

  @Post(':id/units')
  async createUnit(@Param('id') id: string, @Body() data: any, @CurrentUser() user: any) {
    return this.propertiesService.createUnit(id, data, user.id);
  }

  @Get('units/:unitId')
  async getUnit(@Param('unitId') unitId: string, @CurrentUser() user: any) {
    return this.propertiesService.getUnitById(unitId, user.id);
  }
}
