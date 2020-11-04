import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankController } from './bank.controller';
import { BankRepository } from './bank.repository';
import { BankService } from './bank.service';

@Module({
  imports: [TypeOrmModule.forFeature([BankRepository])],
  controllers: [BankController],
  providers: [BankService]
})
export class BankModule {}
