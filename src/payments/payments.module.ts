import { HttpModule, Module } from '@nestjs/common';
import { ShopsModule } from 'src/shops/shops.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BanksModule } from '../bank/banks.module';
import { CreditCardsModule } from '../credit-cards/credit-cards.module';
import { AccountsModule } from '../accounts/accounts.module';
import { CreditCardPurchaseService } from './services/credit-card-purchase.service';
import { ExternalBankPaymentService } from './services/external-bank-payment.service';
import { UtilsService } from './services/utils.service';

@Module({
  imports: [
    ShopsModule,
    BanksModule,
    HttpModule,
    CreditCardsModule,
    AccountsModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    CreditCardPurchaseService,
    ExternalBankPaymentService,
    UtilsService,
  ],
})
export class PaymentsModule {}
