import {
  BadRequestException,
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BanksService } from 'src/bank/banks.service';
import { CreditCardPaymentDto } from './dto/credit-card-payment.dto';

@Injectable()
export class ExternalBankPaymentService {
  constructor(
    private banksService: BanksService,
    private httpService: HttpService,
  ) {}

  async handlePayment(
    creditCardPaymentDto: CreditCardPaymentDto,
  ): Promise<any> {
    const bankCode = creditCardPaymentDto.creditCardNumber.slice(0, 4);
    const bank = await this.banksService.getBankByCreditCardCode(bankCode);

    if (!bank) {
      throw new BadRequestException(
        `We couldn't find a bank for this credit card`,
      );
    }

    const apiEndPoint = bank.apiEndPoint;

    try {
      const response = await this.httpService
        .post(apiEndPoint, creditCardPaymentDto, {
          headers: {
            apikey: bank.apiKey,
          },
        })
        .toPromise();

      // add money yo store account
      return response.data;
    } catch (e) {
      return new InternalServerErrorException();
    }
  }
}
