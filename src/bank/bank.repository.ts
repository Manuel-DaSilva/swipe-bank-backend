import { EntityRepository, Repository } from "typeorm";
import { Bank } from "./bank.entity";
import { v4 as uuidv4 } from 'uuid';
import { InternalServerErrorException } from "@nestjs/common";
import { BankService } from "./bank.service";

@EntityRepository(Bank)
export class BankRepository extends Repository<Bank> {
    
    async createBank(bank: Bank): Promise<Bank> {
        const newBank = new Bank();

        newBank.apiEndpoint = bank.apiEndpoint;
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

    async getBanks(): Promise<Bank[]> {
        try {
            return await this.find();
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async getBank(id:number):Promise<Bank> {
        try {
            return await this.getBank(id);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async updateBank(id:number, bank:Bank):Promise<Bank> {
        try {
            return await this.updateBank(id, bank);
        } catch (e) {
            throw new InternalServerErrorException();
        }        
    }

    async deleteBank(id:number):Promise<Bank> {
        try {
            return await this.deleteBank(id);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}