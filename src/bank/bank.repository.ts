import { EntityRepository, Repository } from 'typeorm';
import { Bank } from './bank.entity';
import { v4 as uuidv4 } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Bank)
export class BankRepository extends Repository<Bank> {
  async createBank(bank: Bank): Promise<Bank> {
    const newBank = new Bank();

    newBank.apiEndPoint = bank.apiEndPoint;
    newBank.code = bank.code;
    newBank.name = bank.name;
    newBank.apiKey = uuidv4();

    try {
      await newBank.save();
      return newBank;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
