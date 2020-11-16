import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// services
import { CreditCardsService } from '../../credit-cards/credit-cards.service';
import { AccountsService } from '../../accounts/accounts.service';
import { UtilsService } from '../../utils/utils.service';

// models
import { CreditCardPaymentDto } from '../dto/credit-card-payment.dto';
import { PaymentResponse } from '../response/payment-response.class';
import { Transaction } from '../../transactions/transaction.entity';
import { CreditCard } from 'src/credit-cards/credit-card.entity';
import { Account } from '../../accounts/account.entity';
import { Shop } from '../../shops/shop.entity';

// utils
import { TransactionType } from 'src/transactions/transaction-type.enum';
import { TransactionNature } from 'src/transactions/transaction-nature.enum';
import { v4 as uuidv4 } from 'uuid';

// typeorm
import { Connection } from 'typeorm';

@Injectable()
export class CreditCardPurchaseService {
  private readonly logger = new Logger('CREDI CARD PURCHASE');

  constructor(
    private connection: Connection,
    private creditCardsService: CreditCardsService,
    private accountsService: AccountsService,
    private utilsService: UtilsService,
  ) {}

  /*
   * @desc handles the complete payment from this bank
   * @param "creditCardPaymentDto" credit card data
   * @param "shop" shop already gotten whose payment is it
   */
  async handlePayment(
    creditCardPaymentDto: CreditCardPaymentDto,
    shop: Shop,
  ): Promise<PaymentResponse> {
    // getting payment creditcard
    const creditCard = await this.creditCardsService.getCreditCardFromPayment(
      creditCardPaymentDto,
    );

    if (!creditCard) {
      this.logger.error(
        `${creditCardPaymentDto.creditCardNumber} was used but not card found`,
      );
      throw new BadRequestException(
        'Invalid payment: Credit card data does not match our records.',
      );
    }

    // check is balance is enough to make the payment
    if (
      !this.utilsService.isPaymentValid(creditCard, creditCardPaymentDto.amount)
    ) {
      this.logger.error(
        `${creditCard.number} was used but has not founds for ${creditCardPaymentDto.amount}`,
      );
      throw new BadRequestException('Invalid payment: Insufficient funds');
    }

    // getting the account for the shop
    const shopAccount = await this.accountsService.getAccountById(
      shop.accountId,
    );

    // building query runner for transactions registration
    const queryRunner = this.connection.createQueryRunner();
    this.logger.log('DB transaction started');
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // unique transaction reference
      const transactionRef = uuidv4();

      // updating account
      await queryRunner.manager.update(Account, shop.accountId, {
        balance: shopAccount.balance + creditCardPaymentDto.amount,
      });
      this.logger.log(
        `Updating account with ${
          shop.accountId
        } balance: ${shopAccount.balance + creditCardPaymentDto.amount}`,
      );

      // creating credit transaction
      const transactionA = this.utilsService.generateTransaction(
        null,
        shop.accountId,
        TransactionType.CREDIT_CARD_PAYMENT,
        TransactionNature.CREDIT,
        transactionRef,
        `${creditCardPaymentDto.description} e-commerce: ${shop.name}`,
        creditCardPaymentDto.amount,
      );
      await queryRunner.manager.save(Transaction, transactionA);

      // updating creditCard
      await queryRunner.manager.update(CreditCard, creditCard.id, {
        balance: creditCard.balance - creditCardPaymentDto.amount,
      });
      this.logger.log(
        `Updating credit card with id${
          shop.accountId
        }, balance: ${creditCard.balance - creditCardPaymentDto.amount}`,
      );

      // creating debit transaction
      const transactionB = this.utilsService.generateTransaction(
        creditCard.id,
        null,
        TransactionType.CREDIT_CARD_PAYMENT,
        TransactionNature.DEBIT,
        transactionRef,
        `${creditCardPaymentDto.description} - ${shop.name}`,
        creditCardPaymentDto.amount,
      );
      await queryRunner.manager.save(Transaction, transactionB);

      // save transactions
      await queryRunner.commitTransaction();

      // building payment response
      const succesfullPayment: PaymentResponse = {
        message: 'Payment successfull',
        amount: creditCardPaymentDto.amount,
        ref: transactionRef,
        description: `${creditCardPaymentDto.description} - ${shop.name}`,
      };
      this.logger.log(`Transaction register with ref: ${transactionRef}`);
      this.logger.log('Transaction successfull');
      return succesfullPayment;
    } catch (error) {
      this.logger.error('Error during transaction');

      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      this.logger.log('DB transaction ended');

      await queryRunner.release();
    }
  }
}
