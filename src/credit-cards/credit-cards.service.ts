import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreditCard } from './credit-card.entity';
import { CreditCardReposity } from './credit-card.repository';

@Injectable()
export class CreditCardsService {
  constructor(
    @InjectRepository(CreditCardReposity)
    private creditCardReposity: CreditCardReposity,
  ) {}

  createCard(user: User): Promise<CreditCard> {
    console.log('service', user);
    return this.creditCardReposity.createCreditCard(user);
  }

  getAllCards(user: User): Promise<CreditCard[]>{
    return this.creditCardReposity.getAllCreditCards(user);
  }
}
