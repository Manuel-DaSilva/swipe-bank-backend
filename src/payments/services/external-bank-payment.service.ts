import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

//services
import { CreditCardsService } from 'src/credit-cards/credit-cards.service';
import { UtilsService } from '../../utils/utils.service';

// models
import { CreditCardPaymentDto } from '../dto/credit-card-payment.dto';
import { PaymentResponse } from '../response/payment-response.class';
import { Transaction } from 'src/transactions/transaction.entity';
import { CreditCard } from 'src/credit-cards/credit-card.entity';

// typeorm
import { Connection } from 'typeorm';

// utils
import { TransactionNature } from 'src/transactions/transaction-nature.enum';
import { TransactionType } from 'src/transactions/transaction-type.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExternalBankPaymentService {
  constructor(
    private creditCardsService: CreditCardsService,
    private utilsService: UtilsService,
    private connection: Connection,
  ) {}

  async handlePayment(
    creditCardPaymentDto: CreditCardPaymentDto,
  ): Promise<PaymentResponse> {
    // getting payment creditcard
    const creditCard = await this.creditCardsService.getCreditCardFromPayment(
      creditCardPaymentDto,
    );

    if (!creditCard) {
      throw new BadRequestException('The credit card info is wrong');
    }

    // check is balance is enough to make the payment
    if (
      !this.utilsService.isPaymentValid(creditCard, creditCardPaymentDto.amount)
    ) {
      throw new BadRequestException('invalid transaction');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // unique transaction reference
      const transactionRef = creditCardPaymentDto.ref;

      // updating creditCard
      await queryRunner.manager.update(CreditCard, creditCard.id, {
        balance: creditCard.balance - creditCardPaymentDto.amount,
      });

      const fullDescription = `${creditCardPaymentDto.description} - ${creditCardPaymentDto.commerce}`;

      // creating debit transaction
      const transaction = this.utilsService.generateTransaction(
        creditCard.id,
        null,
        TransactionType.CREDIT_CARD_PAYMENT,
        TransactionNature.DEBIT,
        transactionRef,
        fullDescription,
        creditCardPaymentDto.amount,
      );
      await queryRunner.manager.save(Transaction, transaction);

      await queryRunner.commitTransaction();
      // building response
      const succesfullPayment: PaymentResponse = {
        message: 'Payment successfull',
        amount: creditCardPaymentDto.amount,
        ref: transactionRef,
        description: fullDescription,
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
