import {
  CREDIT_CARD_CODE,
  CREDIT_CARD_EXPIRATION_TIME,
} from './../config/bank.config';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreditCard } from './credit-card.entity';
import { CreditCardStatus } from './credit-card-status.enum';
import { CREDIT_CARD_LIMIT } from 'src/config/bank.config';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@EntityRepository(CreditCard)
export class CreditCardReposity extends Repository<CreditCard> {
  async createCreditCard(user: User): Promise<CreditCard> {
    const creditCard = new CreditCard();

    creditCard.number = this.generateCardNumber();
    creditCard.balance = CREDIT_CARD_LIMIT;
    creditCard.status = CreditCardStatus.ACTIVE;
    creditCard.limit = CREDIT_CARD_LIMIT;
    const expirationDate = new Date(Date.now());
    expirationDate.setFullYear(
      expirationDate.getFullYear() + CREDIT_CARD_EXPIRATION_TIME,
    );
    creditCard.expirationDate = expirationDate;
    creditCard.securityCode = parseInt(this.generateChunk());
    creditCard.name = user.fullName.toUpperCase();
    creditCard.user = user;

    try {
      await creditCard.save();
      delete creditCard.user;
      return creditCard;
    } catch (e) {
      console.log(e);

      throw new InternalServerErrorException();
    }
  }

  async getAllCreditCards(user: User): Promise<CreditCard[]> {
    const creditCards = await CreditCard.find({
      where: {
        userId: user.id,
        status: CreditCardStatus.ACTIVE,
      },
    });

    return creditCards;
  }

  async closeCreditCard(id: number, user: User): Promise<void> {
    const creditCard = await CreditCard.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (creditCard) {
      creditCard.status = CreditCardStatus.CLOSED;
      await creditCard.save();
    } else {
      throw new NotFoundException('Credit card not found.');
    }
  }

  private generateCardNumber(): string {
    const number = `${CREDIT_CARD_CODE}${this.generateChunk()}${this.generateChunk()}${this.generateChunk()}`;

    return number;
  }

  private generateChunk(): string {
    const value = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    return value.toString();
  }
}
