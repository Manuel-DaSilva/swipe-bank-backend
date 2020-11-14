import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreditCardPaymentDto } from './dto/credit-card-payment.dto';
import { ShopsService } from '../shops/shops.service';
import { CREDIT_CARD_CODE } from 'src/config/bank.config';
import { CreditCardPurchaseService } from './services/credit-card-purchase.service';
import { ExternalBankPaymentService } from './services/external-bank-payment.service';
import { BanksService } from '../bank/banks.service';
import { PaymentResponse } from './response/payment-response.class';
import { ExternalBankRedirectPaymentService } from './services/external-bank-redirect-payment.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger('PAYMENT');

  constructor(
    private creditCardPurchaseService: CreditCardPurchaseService,
    private externalBankPaymentService: ExternalBankPaymentService,
    private externalBankRedirectPaymentService: ExternalBankRedirectPaymentService,
    private banksService: BanksService,
    private shopsService: ShopsService,
  ) {}

  /*
   * @desc Handles the request directly sent from the e-commerce
   * @param "creditCardPaymentDto" credit card data
   * @param "apikey" of the e-commerce
   */
  async creditCardPayment(
    creditCardPaymentDto: CreditCardPaymentDto,
    apikey: string,
  ): Promise<PaymentResponse> {
    const shop = await this.shopsService.getShopByApiKey(apikey);

    if (!shop) {
      this.logger.error(`${apikey} was used but not e-commerce found`);
      throw new UnauthorizedException(`Invalid e-commerce apikey '${apikey}'.`);
    }

    if (this.isForOtherBank(creditCardPaymentDto.creditCardNumber)) {
      this.logger.log('Redirecting to other bank');
      return this.externalBankRedirectPaymentService.redirectPayment(
        creditCardPaymentDto,
        shop,
      );
    } else {
      this.logger.log('Handling payment on bank');
      return this.creditCardPurchaseService.handlePayment(
        creditCardPaymentDto,
        shop,
      );
    }
  }

  /*
   * @desc Handle the incoming payment from another bank
   * @param "creditCardPaymentDto" credit card data
   * @param "apikey" of the bank
   */
  async redirectedPayment(
    creditCardPaymentDto: CreditCardPaymentDto,
    apikey: string,
  ) {
    const bank = await this.banksService.getBankByApiKey(apikey);

    if (!bank) {
      this.logger.error(`${apikey} was used but not bank found`);
      throw new UnauthorizedException(
        `We couldn't find a bank with this apikey ${apikey}`,
      );
    }

    return this.externalBankPaymentService.handlePayment(creditCardPaymentDto);
  }

  // checks if a credit card belongs to this bank
  private isForOtherBank(cardNumber: string): boolean {
    const bankCode = cardNumber.slice(0, 4);
    return bankCode !== CREDIT_CARD_CODE;
  }
}
