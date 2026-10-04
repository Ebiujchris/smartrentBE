import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  create(@CurrentUser() user: any, @Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(user.id, createTenantDto);
  }

  @Post('register')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  register(@CurrentUser() user: any, @Body() dto: RegisterTenantDto) {
    return this.tenantsService.register(user, dto);
  }

  @Get()
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  findAll(@CurrentUser() user: any) {
    return this.tenantsService.findAll(user.id);
  }

  // Specific routes MUST come before parametrized routes
  @Get('current')
  @Roles('TENANT')
  getCurrentTenant(@CurrentUser() user: any) {
    return this.tenantsService.getCurrentTenant(user.id);
  }

  @Get(':id')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN', 'TENANT')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tenantsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto, @CurrentUser() user: any) {
    return this.tenantsService.update(id, updateTenantDto, user);
  }

  @Delete(':id')
  @Roles('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tenantsService.remove(id, user);
  }

}
