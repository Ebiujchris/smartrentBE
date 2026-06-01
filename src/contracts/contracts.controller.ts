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
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() createContractDto: CreateContractDto,
  ) {
    return this.contractsService.create(user.userId, createContractDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.contractsService.findAll(user.userId, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.findOne(id, user.userId, user.role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(id, user.userId, updateContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.delete(id, user.userId);
  }

  @Post(':id/send')
  sendContract(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.sendContract(id, user.userId);
  }

  @Post(':id/accept')
  acceptContract(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.acceptContract(id, user.userId);
  }

  @Post(':id/reject')
  rejectContract(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('reason') reason: string,
  ) {
    return this.contractsService.rejectContract(id, user.userId, reason);
  }
}
