import { HttpModule, Module } from '@nestjs/common';
import { ShopsModule } from 'src/shops/shops.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BanksModule } from '../bank/banks.module';
import { CreditCardPaymentService } from './credit-card-payment.service';
import { ExternalBankPaymentService } from './external-bank-payment.service';
import { CreditCardsModule } from '../credit-cards/credit-cards.module';

@Module({
  imports: [ShopsModule, BanksModule, HttpModule, CreditCardsModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    CreditCardPaymentService,
    ExternalBankPaymentService,
  ],
})
export class PaymentsModule {}
