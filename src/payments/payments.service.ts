import { BadRequestException, Injectable } from '@nestjs/common';
import { CreditCardPaymentDto } from './dto/credit-card-payment.dto';
import { ShopsService } from '../shops/shops.service';
import { CREDIT_CARD_CODE } from 'src/config/bank.config';
import { BanksService } from '../bank/banks.service';

@Injectable()
export class PaymentsService {
  constructor(
    private shopsService: ShopsService,
    private banksService: BanksService,
  ) {}

  async creditCardPayment(creditCardPaymentDto: CreditCardPaymentDto) {
    const shop = await this.shopsService.getShopByApiKey(
      creditCardPaymentDto.shopApiKey,
    );

    if (!shop) {
      throw new BadRequestException(`We couldn't find a shop with this apiKey`);
    }

    // check if is our card

    if (this.isForOtherBank(creditCardPaymentDto.creditCardNumber)) {
      return this.otherBankPayment(creditCardPaymentDto);
    } else {
      return this.doOwnPayment();
    }
  }

  private isForOtherBank(cardNumber: string): boolean {
    const bankCode = cardNumber.slice(0, 4);
    console.log(bankCode);

    return bankCode !== CREDIT_CARD_CODE;
  }

  private async otherBankPayment(creditCardPaymentDto: CreditCardPaymentDto) {
    const bankCode = creditCardPaymentDto.creditCardNumber.slice(0, 4);
    const bank = await this.banksService.getBankByCreditCardCode(bankCode);
    if (!bank) {
      throw new BadRequestException(
        `We couldn't find a bank for this credit card`,
      );
    }
    return { success: true, otherBank: true };
  }

  private doOwnPayment() {
    return { success: true, otherBank: false };
  }
}
