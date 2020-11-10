import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CreditCardReposity } from './credit-card.repository';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsController } from './credit-cards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCardReposity]), AuthModule],
  controllers: [CreditCardsController],
  providers: [CreditCardsService],
  exports: [CreditCardsService],
})
export class CreditCardsModule {}
