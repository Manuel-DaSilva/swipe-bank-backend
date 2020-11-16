import {
  BadGatewayException,
  BadRequestException,
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

//services
import { AccountsService } from 'src/accounts/accounts.service';
import { BanksService } from 'src/bank/banks.service';
import { UtilsService } from '../../utils/utils.service';

// models
import { CreditCardPaymentDto } from '../dto/credit-card-payment.dto';
import { PaymentResponse } from '../response/payment-response.class';
import { Transaction } from 'src/transactions/transaction.entity';
import { Account } from 'src/accounts/account.entity';
import { Shop } from '../../shops/shop.entity';

// typeorm
import { Connection } from 'typeorm';

// utils
import { TransactionNature } from 'src/transactions/transaction-nature.enum';
import { TransactionType } from 'src/transactions/transaction-type.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExternalBankRedirectPaymentService {
  constructor(
    private banksService: BanksService,
    private httpService: HttpService,
    private utilsService: UtilsService,
    private connection: Connection,
    private accountsService: AccountsService,
  ) {}

  /**
   * @desc this handles the incoming payment request from
   * the shop, but the credit card of the client belong to
   * another bank so the request is redirecte to this other bank
   * @param "creditCardPaymentDto" credit card data
   * @param "shop" shop already gotten whose payment is it
   */
  async redirectPayment(
    creditCardPaymentDto: CreditCardPaymentDto,
    shop: Shop,
  ): Promise<PaymentResponse> {
    // getting bank of the credit card
    const bankCode = creditCardPaymentDto.creditCardNumber.slice(0, 4);
    const bank = await this.banksService.getBankByCreditCardCode(bankCode);
    if (!bank) {
      throw new BadRequestException(
        `We couldn't find a bank for this credit card`,
      );
    }

    // preparing bank request
    const apiEndPoint = bank.apiEndPoint;
    const bankCreditCardPaymentDto: CreditCardPaymentDto = {
      ...creditCardPaymentDto,
      commerce: shop.name,
      ref: uuidv4(),
    };

    try {
      // external bank request
      const response = await this.httpService
        .post(apiEndPoint, bankCreditCardPaymentDto, {
          headers: {
            apikey: bank.serviceApiKey,
          },
        })
        .toPromise();
      console.log(response.data);

      if (response.status !== 200) {
        throw new BadGatewayException(
          response.data.message ||
            'Error while getting response from external bank',
        );
      }

      // getting the account for the shop
      const shopAccount = await this.accountsService.getAccountById(
        shop.accountId,
      );

      // building query runner for transaction registration
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // unique transaction reference
        const transactionRef = response.data.ref;

        // updating account
        await queryRunner.manager.update(Account, shopAccount.id, {
          balance: shopAccount.balance + creditCardPaymentDto.amount,
        });

        const fullDescription = `${response.data.description} - ${shop.name}`;

        // creating credit transaction
        const transaction = this.utilsService.generateTransaction(
          null,
          shop.accountId,
          TransactionType.CREDIT_CARD_PAYMENT,
          TransactionNature.CREDIT,
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
    } catch (error) {
      const errorMessage =
        error.response.data.msg || 'We could get a response from the bank';
      throw new BadGatewayException(errorMessage);
    }
  }
}
