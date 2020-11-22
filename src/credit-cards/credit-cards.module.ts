import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CreditCardReposity } from './credit-card.repository';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsController } from './credit-cards.controller';
import { UtilsService } from 'src/utils/utils.service';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreditCardReposity]),
    AuthModule,
    UtilsService,
    AccountsModule,
  ],
  controllers: [CreditCardsController],
  providers: [CreditCardsService, UtilsService],
  exports: [CreditCardsService],
})
export class CreditCardsModule {}
