import { EntityRepository, Repository } from 'typeorm';
import { Bank } from './bank.entity';
import { v4 as uuidv4 } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';

@EntityRepository(Bank)
export class BankRepository extends Repository<Bank> {
  async createBank(createBankDto: CreateBankDto): Promise<Bank> {
    const newBank = new Bank();

    newBank.apiEndPoint = createBankDto.apiEndPoint;
    newBank.code = createBankDto.code;
    newBank.name = createBankDto.name;
    newBank.serviceApiKey = createBankDto.serviceApiKey;
    newBank.swipeApiKey = uuidv4();

    try {
      await newBank.save();
      return newBank;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
