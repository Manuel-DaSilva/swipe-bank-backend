import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { bankDto } from './bank.dto';
import { Bank } from './bank.entity';
import { BankService } from './bank.service';

@Controller('bank')
export class BankController {

    constructor(private bankService: BankService) {}

    @Get()
    getAllBanks(): Promise<Bank[]> {
        return this.bankService.getBanks();
    }

    @Get(':id')
    getBankById(@Param('id') id: number): Promise<Bank> {        
        return this.bankService.getBank(id);
    }

    @Post()
    createBank(@Body() bank: Bank): Promise<Bank> {
        return this.bankService.createBank(bank);
    }

    @Put(':id')
    updateBank(@Param('id') id: number, @Body() bank: Bank): Promise<Bank> {  
        return this.bankService.updateBank(id, bank);
    }

    @Delete(':id')
    deleteBank(@Param('id') id: number) {
        return this.bankService.deleteBank(id);
    }


}
