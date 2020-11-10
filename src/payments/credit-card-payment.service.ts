import { Account } from './../accounts/account.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreditCardPaymentDto } from './dto/credit-card-payment.dto';
import { Shop } from '../shops/shop.entity';
import { CreditCardsService } from '../credit-cards/credit-cards.service';

@Injectable()
export class CreditCardPaymentService {
  constructor(
    private connection: Connection,
    private creditCardsService: CreditCardsService,
  ) {}

  async handlePayment(creditCardPaymentDto: CreditCardPaymentDto, shop: Shop) {
    // GET CREDIT CARD
    const creditCard = await this.creditCardsService.getCreditCardForPayment(
      creditCardPaymentDto,
    );

    if (!creditCard) {
      throw new BadRequestException('The credit card info is wrong');
    }

    console.log(creditCard);

    // CHECK IF PAYMENT IS POSIBLE
    if (creditCard) {
      throw new BadRequestException('No tiene plata mijo');
    }

    // GET COMMERCE ACCOUNT

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Account, shop.accountId, {
        balance: 1000,
      });
      // transation to
      // * Add + money into shop account
      // transaction to shop account credit
      // * Remove - money from user credit-card
      // transaction to creditcard debit
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
