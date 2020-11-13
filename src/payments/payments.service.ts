import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreditCardPaymentDto } from './dto/credit-card-payment.dto';
import { ShopsService } from '../shops/shops.service';
import { CREDIT_CARD_CODE } from 'src/config/bank.config';
import { CreditCardPurchaseService } from './services/credit-card-purchase.service';
import { ExternalBankPaymentService } from './services/external-bank-payment.service';
import { BanksService } from '../bank/banks.service';
import { PaymentResponse } from './response/payment-response.class';

@Injectable()
export class PaymentsService {
  constructor(
    private creditCardPurchaseService: CreditCardPurchaseService,
    private externalBankPaymentService: ExternalBankPaymentService,
    private banksService: BanksService,
    private shopsService: ShopsService,
  ) {}

  async creditCardPayment(
    creditCardPaymentDto: CreditCardPaymentDto,
    apikey: string,
  ): Promise<PaymentResponse> {
    const shop = await this.shopsService.getShopByApiKey(apikey);

    if (!shop) {
      throw new UnauthorizedException(`Invalid e-commerce apikey '${apikey}'.`);
    }

    if (this.isForOtherBank(creditCardPaymentDto.creditCardNumber)) {
      return this.externalBankPaymentService.redirectPayment(
        creditCardPaymentDto,
        shop,
      );
    } else {
      return this.creditCardPurchaseService.handlePayment(
        creditCardPaymentDto,
        shop,
      );
    }
  }

  async redirectedPayment(
    creditCardPaymentDto: CreditCardPaymentDto,
    apikey: string,
  ) {
    const bank = await this.banksService.getBankByApiKey(apikey);

    if (!bank) {
      throw new BadRequestException(
        `We couldn't find a bank with this apikey ${apikey}`,
      );
    }

    return this.externalBankPaymentService.handlePayment(creditCardPaymentDto);
  }

  private isForOtherBank(cardNumber: string): boolean {
    const bankCode = cardNumber.slice(0, 4);
    return bankCode !== CREDIT_CARD_CODE;
  }
}
