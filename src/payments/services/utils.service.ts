import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreditCard } from 'src/credit-cards/credit-card.entity';
import { TransactionNature } from 'src/transactions/transaction-nature.enum';
import { TransactionType } from 'src/transactions/transaction-type.enum';
import { Transaction } from 'src/transactions/transaction.entity';
import { CreditCardPaymentDto } from '../dto/credit-card-payment.dto';

@Injectable()
export class UtilsService {
  generateTransaction(
    creditCardId: number,
    accountId: number,
    type: TransactionType,
    nature: TransactionNature,
    ref: string,
    description: string,
    amount: number,
  ): Transaction {
    if (creditCardId === null && accountId === null) {
      throw new InternalServerErrorException();
    }

    const transaction = new Transaction();
    transaction.accountId = accountId ?? null;
    transaction.creditCardId = creditCardId ?? null;
    transaction.amount = amount;
    transaction.type = type;
    transaction.nature = nature;
    transaction.ref = ref;
    transaction.mesage = description;
    return transaction;
  }

  isPaymentValid(creditCard: CreditCard, paymentAmount: number): boolean {
    return creditCard.balance - paymentAmount >= 0;
  }
}
