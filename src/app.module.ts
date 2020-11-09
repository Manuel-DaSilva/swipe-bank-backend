import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ShopsModule } from './shops/shops.module';
import { AccountsModule } from './accounts/accounts.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ShopsModule,
    AccountsModule,
    CreditCardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
