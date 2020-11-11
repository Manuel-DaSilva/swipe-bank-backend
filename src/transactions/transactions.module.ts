import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { TransactionsController } from './transactions.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionRepository]),
    AccountsModule,
    PaymentsModule,
    AuthModule,
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
