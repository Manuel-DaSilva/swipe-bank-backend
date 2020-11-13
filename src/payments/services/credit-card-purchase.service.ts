import { Account } from '../../accounts/account.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreditCardPaymentDto } from '../dto/credit-card-payment.dto';
import { Shop } from '../../shops/shop.entity';
import { CreditCardsService } from '../../credit-cards/credit-cards.service';
import { CreditCard } from 'src/credit-cards/credit-card.entity';
import { AccountsService } from '../../accounts/accounts.service';
import { Transaction } from '../../transactions/transaction.entity';
import { TransactionType } from 'src/transactions/transaction-type.enum';
import { TransactionNature } from 'src/transactions/transaction-nature.enum';
import { v4 as uuidv4 } from 'uuid';
import { UtilsService } from './utils.service';
import { PaymentResponse } from '../response/payment-response.class';

@Injectable()
export class CreditCardPurchaseService {
  constructor(
    private connection: Connection,
    private creditCardsService: CreditCardsService,
    private accountsService: AccountsService,
    private utilsService: UtilsService,
  ) {}

  async handlePayment(
    creditCardPaymentDto: CreditCardPaymentDto,
    shop: Shop,
  ): Promise<PaymentResponse> {
    // getting payment creditcard
    const creditCard = await this.creditCardsService.getCreditCardForPayment(
      creditCardPaymentDto,
    );

    if (!creditCard) {
      throw new BadRequestException(
        'Invalid payment: Credit card data does not match our records.',
      );
    }

    // check is balance is enough to make the payment
    if (
      !this.utilsService.isPaymentValid(creditCard, creditCardPaymentDto.amount)
    ) {
      throw new BadRequestException('Invalid payment: Insufficient funds');
    }

    // getting the account for the shop
    const shopAccount = await this.accountsService.getAccountById(
      shop.accountId,
    );

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // unique transaction reference
      const transactionRef = uuidv4();

      // updating account
      await queryRunner.manager.update(Account, shop.accountId, {
        balance: shopAccount.balance + creditCardPaymentDto.amount,
      });

      // creating credit transaction
      const transactionA = this.utilsService.generateTransaction(
        null,
        shop.accountId,
        TransactionType.CREDIT_CARD_PAYMENT,
        TransactionNature.CREDIT,
        transactionRef,
        creditCardPaymentDto.description,
        creditCardPaymentDto.amount,
      );
      await queryRunner.manager.save(Transaction, transactionA);

      // updating creditCard
      await queryRunner.manager.update(CreditCard, creditCard.id, {
        balance: creditCard.balance - creditCardPaymentDto.amount,
      });

      // creating debit transaction
      const transactionB = this.utilsService.generateTransaction(
        creditCard.id,
        null,
        TransactionType.CREDIT_CARD_PAYMENT,
        TransactionNature.DEBIT,
        transactionRef,
        creditCardPaymentDto.description,
        creditCardPaymentDto.amount,
      );
      await queryRunner.manager.save(Transaction, transactionB);

      await queryRunner.commitTransaction();
      const succesfullPayment: PaymentResponse = {
        message: 'Payment successfull',
        amount: creditCardPaymentDto.amount,
        ref: transactionRef,
        description: creditCardPaymentDto.description,
      };
      return succesfullPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
