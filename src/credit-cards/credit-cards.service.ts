import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreditCardPaymentDto } from 'src/payments/dto/credit-card-payment.dto';
import { CreditCardStatus } from './credit-card-status.enum';
import { CreditCard } from './credit-card.entity';
import { CreditCardReposity } from './credit-card.repository';

@Injectable()
export class CreditCardsService {
  constructor(
    @InjectRepository(CreditCardReposity)
    private creditCardReposity: CreditCardReposity,
  ) {}

  createCard(user: User): Promise<CreditCard> {
    return this.creditCardReposity.createCreditCard(user);
  }

  getCreditCardForPayment(creditCardPaymentDto: CreditCardPaymentDto) {
    return this.creditCardReposity.findOne({
      number: creditCardPaymentDto.creditCardNumber.toUpperCase(),
      // expirationDate: creditCardPaymentDto
      securityCode: parseInt(creditCardPaymentDto.creditCardSecurityCode),
      name: creditCardPaymentDto.creditCardName.toUpperCase(),
      status: CreditCardStatus.ACTIVE,
    });
  }

  getAllCards(user: User): Promise<CreditCard[]> {
    return this.creditCardReposity.getAllCreditCards(user);
    // return this.creditCardReposity.find({
    //   userId: user.id
    // });
  }

  closeCard(id: number, user: User): Promise<void> {
    return this.creditCardReposity.closeCreditCard(id, user);
  }
}
