import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { BanksModule } from './bank/banks.module';
import { ShopsModule } from './shops/shops.module';
import { AccountsModule } from './accounts/accounts.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { PaymentsModule } from './payments/payments.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    BanksModule,
    AuthModule,
    ShopsModule,
    AccountsModule,
    CreditCardsModule,
    PaymentsModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
