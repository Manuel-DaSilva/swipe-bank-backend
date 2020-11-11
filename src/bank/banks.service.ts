import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { BankRepository } from './bank.repository';
import { CreateBankDto } from './dto/create-bank.dto';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(BankRepository)
    private bankRepository: BankRepository,
  ) {}

  async createBank(createBankDto: CreateBankDto): Promise<Bank> {
    return this.bankRepository.createBank(createBankDto);
  }

  async getBanks(): Promise<Bank[]> {
    return this.bankRepository.find();
  }

  async getBankByCreditCardCode(creditCardCode: string): Promise<Bank> {
    return this.bankRepository.findOne({ code: creditCardCode });
  }

  async getBankByApiKey(apiKey: string): Promise<Bank> {
    return this.bankRepository.findOne({ swipeApiKey: apiKey });
  }
}
