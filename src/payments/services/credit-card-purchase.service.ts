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

@Injectable()
export class CreditCardPurchaseService {
  constructor(
    private connection: Connection,
    private creditCardsService: CreditCardsService,
    private accountsService: AccountsService,
  ) {}

  async handlePayment(
    creditCardPaymentDto: CreditCardPaymentDto,
    shop: Shop,
  ): Promise<string> {
    // getting payment creditcard
    const creditCard = await this.creditCardsService.getCreditCardForPayment(
      creditCardPaymentDto,
    );

    if (!creditCard) {
      throw new BadRequestException('The credit card info is wrong');
    }

    // check is balance is enough to make the payment
    if (!this.isPaymentValid(creditCard, creditCardPaymentDto.amount)) {
      throw new BadRequestException('invalid transaction');
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
      const transactionA = this.generateTransaction(
        null,
        shop.accountId,
        TransactionType.CREDIT_CARD_PAYMENT,
        TransactionNature.CREDIT,
        transactionRef,
        creditCardPaymentDto,
      );
      await queryRunner.manager.save(Transaction, transactionA);

      // updating creditCard
      await queryRunner.manager.update(CreditCard, creditCard.id, {
        balance: creditCard.balance + creditCardPaymentDto.amount,
      });

      // creating debit transaction
      const transactionB = this.generateTransaction(
        creditCard.id,
        null,
        TransactionType.CREDIT_CARD_PAYMENT,
        TransactionNature.DEBIT,
        transactionRef,
        creditCardPaymentDto,
      );
      await queryRunner.manager.save(Transaction, transactionB);

      await queryRunner.commitTransaction();

      return 'Payment successfull';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  private generateTransaction(
    creditCardId: number,
    accountId: number,
    type: TransactionType,
    nature: TransactionNature,
    ref: string,
    paymentDto: CreditCardPaymentDto,
  ): Transaction {
    if (creditCardId === null && accountId === null) {
      throw new InternalServerErrorException();
    }

    const transaction = new Transaction();
    transaction.accountId = accountId ?? null;
    transaction.creditCardId = creditCardId ?? null;
    transaction.amount = paymentDto.amount;
    transaction.type = type;
    transaction.nature = nature;
    transaction.ref = ref;
    transaction.mesage = paymentDto.description;
    return transaction;
  }

  private isPaymentValid(
    creditCard: CreditCard,
    paymentAmount: number,
  ): boolean {
    const availableCredit = creditCard.limit - creditCard.balance;
    return availableCredit - paymentAmount >= 0;
  }
}
