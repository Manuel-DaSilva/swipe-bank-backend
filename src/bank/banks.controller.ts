import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Bank } from './bank.entity';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';

@Controller('banks')
export class BanksController {
  constructor(private banksService: BanksService) {}

  @ApiExcludeEndpoint()
  @Get()
  getAllBanks(): Promise<Bank[]> {
    return this.banksService.getBanks();
  }

  @ApiExcludeEndpoint()
  @Post()
  createBank(
    @Body(ValidationPipe) createBankDto: CreateBankDto,
  ): Promise<Bank> {
    return this.banksService.createBank(createBankDto);
  }
}
