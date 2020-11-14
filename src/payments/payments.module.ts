import { HttpModule, Module } from '@nestjs/common';

// modules
import { CreditCardsModule } from '../credit-cards/credit-cards.module';
import { AccountsModule } from '../accounts/accounts.module';
import { ShopsModule } from 'src/shops/shops.module';
import { BanksModule } from '../bank/banks.module';

// controller
import { PaymentsController } from './payments.controller';

// services
import { ExternalBankRedirectPaymentService } from './services/external-bank-redirect-payment.service';
import { ExternalBankPaymentService } from './services/external-bank-payment.service';
import { CreditCardPurchaseService } from './services/credit-card-purchase.service';
import { UtilsService } from '../utils/utils.service';
import { PaymentsService } from './payments.service';

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
    ExternalBankRedirectPaymentService,
    UtilsService,
  ],
  exports: [UtilsService],
})
export class PaymentsModule {}
