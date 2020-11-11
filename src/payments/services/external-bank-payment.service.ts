import {
  BadRequestException,
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BanksService } from 'src/bank/banks.service';
import { CreditCardPaymentDto } from '../dto/credit-card-payment.dto';
import { CreditCardsService } from 'src/credit-cards/credit-cards.service';
import { UtilsService } from './utils.service';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreditCard } from 'src/credit-cards/credit-card.entity';
import { Transaction } from 'src/transactions/transaction.entity';
import { TransactionType } from 'src/transactions/transaction-type.enum';
import { TransactionNature } from 'src/transactions/transaction-nature.enum';
import { Shop } from '../../shops/shop.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/account.entity';

@Injectable()
export class ExternalBankPaymentService {
  constructor(
    private banksService: BanksService,
    private creditCardsService: CreditCardsService,
    private httpService: HttpService,
    private utilsService: UtilsService,
    private connection: Connection,
    private accountsService: AccountsService,
  ) {}

  async redirectPayment(
    creditCardPaymentDto: CreditCardPaymentDto,
    shop: Shop,
  ): Promise<any> {
    const bankCode = creditCardPaymentDto.creditCardNumber.slice(0, 4);
    const bank = await this.banksService.getBankByCreditCardCode(bankCode);

    if (!bank) {
      throw new BadRequestException(
        `We couldn't find a bank for this credit card`,
      );
    }

    const apiEndPoint = bank.apiEndPoint;

    // getting the account for the shop
    const shopAccount = await this.accountsService.getAccountById(
      shop.accountId,
    );

    try {
      const response = await this.httpService
        .post(apiEndPoint, creditCardPaymentDto, {
          headers: {
            apikey: bank.serviceApiKey,
          },
        })
        .toPromise();

      // add money yo store account
      // TODO check response status
      if (response.status !== 201) {
        return new BadRequestException(response.data);
      }

      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // unique transaction reference
        const transactionRef = uuidv4();

        // updating account
        await queryRunner.manager.update(Account, shopAccount.id, {
          balance: shopAccount.balance + creditCardPaymentDto.amount,
        });

        // creating credit transaction
        const transaction = this.utilsService.generateTransaction(
          null,
          shop.accountId,
          TransactionType.CREDIT_CARD_PAYMENT,
          TransactionNature.CREDIT,
          transactionRef,
          creditCardPaymentDto,
        );
        await queryRunner.manager.save(Transaction, transaction);
        await queryRunner.commitTransaction();
        // TODO change payment response
        return 'Payment successfull';
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException();
      } finally {
        await queryRunner.release();
      }

      return response.data;
    } catch (e) {
      return new InternalServerErrorException();
    }
  }

  async handlePayment(creditCardPaymentDto: CreditCardPaymentDto) {
    // getting payment creditcard
    const creditCard = await this.creditCardsService.getCreditCardForPayment(
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
      const transactionRef = uuidv4();

      // updating creditCard
      await queryRunner.manager.update(CreditCard, creditCard.id, {
        balance: creditCard.balance - creditCardPaymentDto.amount,
      });

      // creating debit transaction
      const transaction = this.utilsService.generateTransaction(
        creditCard.id,
        null,
        TransactionType.CREDIT_CARD_PAYMENT,
        TransactionNature.DEBIT,
        transactionRef,
        creditCardPaymentDto,
      );
      await queryRunner.manager.save(Transaction, transaction);

      await queryRunner.commitTransaction();
      // TODO change payment response
      return 'Payment successfull';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
