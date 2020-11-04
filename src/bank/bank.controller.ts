import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { bankDto } from './bank.dto';

@Controller('bank')
export class BankController {

    banks: bankDto[] = [ {id: "1", code: "0102", name:"Venezuela", apiEndpoint: "http"}];

    @Get()
    getAllBanks(): bankDto[] {
        return this.banks;
    }

    @Get(':id')
    getBankById(@Param('id') id: string): bankDto {
        const Bank = this.banks.find(Bank => Bank.id == id);
        return Bank;
    }

    @Post()
    newBank(@Body() Bank: bankDto): bankDto {
        const newBank = {...Bank, id: ''+(this.banks.length)}
        this.banks = [...this.banks, newBank];
        return newBank;
    }

    @Put(':id')
    updateBank(@Param('id') id: string, @Body() Bank: bankDto): bankDto {
        this.banks = this.banks.filter(Bank => Bank.id !== id);
        this.banks = [...this.banks, this.newBank(Bank)];
        return Bank;
    }

    @Delete(':id')
    deleteBank(@Param('id') id: string) {
        this.banks = this.banks.filter(Bank => Bank.id !== id);
    }


}
