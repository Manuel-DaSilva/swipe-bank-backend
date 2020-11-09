import { CREDIT_CARD_EXPIRATION_TIME } from './../config/bank.config';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreditCard } from './credit-card.entity';
import { CreditCardStatus } from './credit-card-status.enum';
import { CREDIT_CARD_LIMIT } from 'src/config/bank.config';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(CreditCard)
export class CreditCardReposity extends Repository<CreditCard> {
  async createCreditCard(user: User): Promise<CreditCard> {
    const creditCard = new CreditCard();

    creditCard.number = uuidv4();
    creditCard.balance = 0;
    creditCard.status = CreditCardStatus.ACTIVE;
    creditCard.limit = CREDIT_CARD_LIMIT;
    const expirationDate = new Date(Date.now());
    expirationDate.setFullYear(
      expirationDate.getFullYear() + CREDIT_CARD_EXPIRATION_TIME,
    );
    creditCard.expirationDate = new Date(Date.now() + 10);
    creditCard.securityCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    creditCard.user = user;
    console.log('repo', user);

    try {
      await creditCard.save();
      delete creditCard.user;
      return creditCard;
    } catch (e) {
      console.log(e);

      throw new InternalServerErrorException();
    }
  }
}
