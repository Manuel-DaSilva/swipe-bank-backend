import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Bank } from './bank.entity';
import { BanksService } from './banks.service';

@Controller('banks')
export class BanksController {
  constructor(private banksService: BanksService) {}

  @Get()
  getAllBanks(): Promise<Bank[]> {
    return this.banksService.getBanks();
  }

  @Post()
  createBank(@Body() bank: Bank): Promise<Bank> {
    return this.banksService.createBank(bank);
  }
}
