import { BadRequestException, Injectable } from '@nestjs/common';
import { CreditCardPaymentDto } from './dto/credit-card-payment.dto';
import { ShopsService } from '../shops/shops.service';
import { CREDIT_CARD_CODE } from 'src/config/bank.config';
import { CreditCardPaymentService } from './credit-card-payment.service';
import { ExternalBankPaymentService } from './external-bank-payment.service';

@Injectable()
export class PaymentsService {
  constructor(
    private creditCardPaymentService: CreditCardPaymentService,
    private externalBankPaymentService: ExternalBankPaymentService,
    private shopsService: ShopsService,
  ) {}

  async creditCardPayment(creditCardPaymentDto: CreditCardPaymentDto) {
    const shop = await this.shopsService.getShopByApiKey(
      creditCardPaymentDto.shopApiKey,
    );

    if (!shop) {
      throw new BadRequestException(`We couldn't find a shop with this apiKey`);
    }

    if (this.isForOtherBank(creditCardPaymentDto.creditCardNumber)) {
      return this.externalBankPaymentService.handlePayment(
        creditCardPaymentDto,
      );
    } else {
      return this.creditCardPaymentService.handlePayment(creditCardPaymentDto);
    }
  }

  private isForOtherBank(cardNumber: string): boolean {
    const bankCode = cardNumber.slice(0, 4);
    return bankCode !== CREDIT_CARD_CODE;
  }
}
