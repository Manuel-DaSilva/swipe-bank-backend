import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { BankRepository } from './bank.repository';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(BankRepository)
    private bankRepository: BankRepository,
  ) {}

  async createBank(bank: Bank): Promise<Bank> {
    return this.bankRepository.createBank(bank);
  }

  async getBanks(): Promise<Bank[]> {
    return this.bankRepository.find();
  }
}
