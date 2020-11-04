import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Bank } from './bank.entity';
import { BankRepository } from './bank.repository';

@Injectable()
export class BankService {
    constructor(
        @InjectRepository(BankRepository)
        private bankRepository: BankRepository,
      ) {}
    
    async createBank(bank: Bank): Promise<Bank> {
        return this.bankRepository.createBank(bank);
    }

    async getBanks(): Promise<Bank[]> {
        return this.bankRepository.getBanks();
    }

    async getBank(id: number): Promise<Bank> {
        return this.bankRepository.getBank(id);
    }

    async updateBank(id:number, bank : Bank): Promise<UpdateResult> {
        return this.bankRepository.updateBank(id, bank);
    }

    async deleteBank(id:number): Promise<DeleteResult> {
        return this.bankRepository.deleteBank(id);
    }
}
