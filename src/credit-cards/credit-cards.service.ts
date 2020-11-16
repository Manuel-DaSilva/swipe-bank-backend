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

  async getCreditCardFromPayment(
    creditCardPaymentDto: CreditCardPaymentDto,
  ): Promise<CreditCard> {
    const creditCard = await this.creditCardReposity.findOne({
      number: creditCardPaymentDto.creditCardNumber.toUpperCase(),
      securityCode: parseInt(creditCardPaymentDto.creditCardSecurityCode),
      name: creditCardPaymentDto.creditCardName.toUpperCase(),
      status: CreditCardStatus.ACTIVE,
    });

    if (!creditCard) {
      return null;
    }
    if (
      this.datesMatch(
        creditCardPaymentDto.creditCardExpirationDate,
        creditCard.expirationDate,
      )
    ) {
      return creditCard;
    } else {
      return null;
    }
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

  private datesMatch(dateString: string, creditCardDate: Date): boolean {
    const date = new Date(creditCardDate);

    const year = date
      .getFullYear()
      .toString()
      .slice(-2);

    const stringFromDto = `${date.getMonth()}/${year}`;
    console.log(stringFromDto);
    console.log(dateString);

    return dateString === stringFromDto;
  }
}
