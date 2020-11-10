import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanksController } from './banks.controller';
import { BankRepository } from './bank.repository';
import { BanksService } from './banks.service';

@Module({
  imports: [TypeOrmModule.forFeature([BankRepository])],
  controllers: [BanksController],
  providers: [BanksService],
  exports: [BanksService],
})
export class BanksModule {}
