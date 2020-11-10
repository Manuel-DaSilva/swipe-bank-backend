import { Injectable } from '@nestjs/common';
import { CreditCardPaymentDto } from './dto/credit-card-payment.dto';

@Injectable()
export class CreditCardPaymentService {
  async handlePayment(creditCardPaymentDto: CreditCardPaymentDto) {
    console.log(creditCardPaymentDto);
    // get credit card
    // check if payment is posible
    // transation to
    // * Add + money into shop account
    // * Remove - money from user credit-card
    //
    return { success: true, otherBank: false };
  }
}
