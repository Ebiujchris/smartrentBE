import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateSubscriptionDto } from './dto/admin-update-subscription.dto';
import { ReplyMessageDto } from './dto/reply-message.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN' as any)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Dashboard ────────────────────────────────────────────────────
  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/user-growth')
  getUserGrowthData() {
    return this.adminService.getUserGrowthData();
  }

  // ─── Users ────────────────────────────────────────────────────────
  @Get('users')
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getUsers({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      role,
      status,
    });
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateDto);
  }

  @Patch('users/:id/suspend')
  suspendUser(@Param('id') id: string) {
    return this.adminService.suspendUser(id);
  }

  @Patch('users/:id/unsuspend')
  unsuspendUser(@Param('id') id: string) {
    return this.adminService.unsuspendUser(id);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ─── Subscriptions ────────────────────────────────────────────────
  @Get('subscriptions')
  getSubscriptions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('plan') plan?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getSubscriptions({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      plan,
      status,
    });
  }

  @Patch('subscriptions/:userId')
  updateSubscription(
    @Param('userId') userId: string,
    @Body() dto: AdminUpdateSubscriptionDto,
  ) {
    return this.adminService.updateSubscription(userId, dto);
  }

  // ─── Messages ─────────────────────────────────────────────────────
  @Get('messages')
  getMessages(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.adminService.getMessages({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      unreadOnly: unreadOnly === 'true',
    });
  }

  @Patch('messages/:id/read')
  markMessageAsRead(@Param('id') id: string) {
    return this.adminService.markMessageAsRead(id);
  }

  @Post('messages/:id/reply')
  replyToMessage(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: ReplyMessageDto,
  ) {
    return this.adminService.replyToMessage(id, user.id, dto);
  }

  // ─── Properties ───────────────────────────────────────────────────
  @Get('properties')
  getProperties(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getProperties({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
    });
  }

  // ─── Payments ─────────────────────────────────────────────────────
  @Get('payments')
  getPayments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getPayments({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
    });
  }

  // ─── Activity Log ─────────────────────────────────────────────────
  @Get('activity-log')
  getActivityLog(@Query('limit') limit?: string) {
    return this.adminService.getActivityLog(limit ? parseInt(limit) : undefined);
  }
}
