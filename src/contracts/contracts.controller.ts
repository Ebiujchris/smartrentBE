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
    return this.contractsService.create(user.id, createContractDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.contractsService.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(id, user.id, updateContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.delete(id, user.id);
  }

  @Post(':id/send')
  sendContract(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.sendContract(id, user.id);
  }

  @Post(':id/accept')
  acceptContract(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.acceptContract(id, user.id);
  }

  @Post(':id/reject')
  rejectContract(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('reason') reason: string,
  ) {
    return this.contractsService.rejectContract(id, user.id, reason);
  }
}
