import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationDto } from 'src/credit-cards/dto/operation.dto';
import { User } from 'src/auth/user.entity';
import { CreditCardPaymentDto } from 'src/payments/dto/credit-card-payment.dto';
import { Transaction } from 'src/transactions/transaction.entity';
import { CreditCardStatus } from './credit-card-status.enum';
import { CreditCard } from './credit-card.entity';
import { CreditCardReposity } from './credit-card.repository';
import { v4 as uuidv4 } from 'uuid';
import { UtilsService } from 'src/utils/utils.service';
import { TransactionType } from 'src/transactions/transaction-type.enum';
import { AccountsService } from '../accounts/accounts.service';
import { Connection } from 'typeorm';
import { Account } from 'src/accounts/account.entity';
import { TransactionNature } from 'src/transactions/transaction-nature.enum';

@Injectable()
export class CreditCardsService {
  constructor(
    @InjectRepository(CreditCardReposity)
    private creditCardReposity: CreditCardReposity,
    private utilsService: UtilsService,
    private accountsService: AccountsService,
    private connection: Connection,
  ) {}

  createCard(user: User): Promise<CreditCard> {
    return this.creditCardReposity.createCreditCard(user);
  }

  async getCreditCardFromPayment(
    creditCardPaymentDto: CreditCardPaymentDto,
  ): Promise<CreditCard> {
    const creditCard = await this.creditCardReposity.findOne({
      number: creditCardPaymentDto.creditCardNumber.toUpperCase(),
      securityCode: parseInt(creditCardPaymentDto.creditCardSecurityCode),
      name: creditCardPaymentDto.creditCardName.toUpperCase(),
      status: CreditCardStatus.ACTIVE,
    });

    if (!creditCard) {
      return null;
    }
    if (
      this.datesMatch(
        creditCardPaymentDto.creditCardExpirationDate,
        creditCard.expirationDate,
      )
    ) {
      return creditCard;
    } else {
      return null;
    }
  }

  getAllCards(user: User): Promise<CreditCard[]> {
    return this.creditCardReposity.getAllCreditCards(user);
    // return this.creditCardReposity.find({
    //   userId: user.id
    // });
  }

  getCardById(user: User, cardId: number): Promise<CreditCard> {
    return this.creditCardReposity.findOne({
      id: cardId,
      userId: user.id,
    });
    // return this.creditCardReposity.find({
    //   userId: user.id
    // });
  }

  closeCard(id: number, user: User): Promise<void> {
    return this.creditCardReposity.closeCreditCard(id, user);
  }

  private datesMatch(dateString: string, creditCardDate: Date): boolean {
    const date = new Date(creditCardDate);

    const year = date
      .getFullYear()
      .toString()
      .slice(-2);

    const stringFromDto = `${date.getMonth() + 1}/${year}`;
    console.log(stringFromDto);
    console.log(dateString);

    return dateString === stringFromDto;
  }

  async getMovements(number: string, user: User): Promise<CreditCard> {
    const creditCard = await this.creditCardReposity.findOne({
      number,
      userId: user.id,
    });

    // creditCard doesnt belongs to the user
    if (!creditCard) {
      throw new BadRequestException();
    }

    return creditCard;
  }

  async payment(operationDto: OperationDto, user): Promise<string> {
    const creditCard = await this.creditCardReposity.findOne({
      userId: user.id,
      number: operationDto.creditCardNumber,
      status: CreditCardStatus.ACTIVE,
    });

    if (!creditCard) {
      throw new BadRequestException('Invalid credit card');
    }

    const result = creditCard.balance + operationDto.amount;

    if (result > creditCard.limit) {
      throw new ConflictException('Trying to exceed credit card limit');
    }

    // getting the account for the shop
    const account = await this.accountsService.getAccountByNumber(
      operationDto.accountNumber,
    );

    if (!account) {
      throw new BadRequestException('Invalid account');
    }

    if (account.balance < operationDto.amount) {
      throw new BadRequestException('Invalid amount account not funds');
    }

    // building query runner for transactions registration
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // unique transaction reference
      const transactionRef = uuidv4();

      // updating account
      await queryRunner.manager.update(Account, account.id, {
        balance: account.balance - operationDto.amount,
      });

      // creating DEBIT transaction
      const transactionA = this.utilsService.generateTransaction(
        null,
        account.id,
        TransactionType.CREDIT_CARD_PAYMENT,
        TransactionNature.DEBIT,
        transactionRef,
        `CARD PAYMENT FROM ACCOUNT`,
        operationDto.amount,
      );
      await queryRunner.manager.save(Transaction, transactionA);

      // updating creditCard
      await queryRunner.manager.update(CreditCard, creditCard.id, {
        balance: creditCard.balance + operationDto.amount,
      });

      // creating CREDIT transaction
      const transactionB = this.utilsService.generateTransaction(
        creditCard.id,
        null,
        TransactionType.CREDIT_CARD_PAYMENT,
        TransactionNature.CREDIT,
        transactionRef,
        `CARD PAYMENT FROM ACCOUNT`,
        operationDto.amount,
      );
      await queryRunner.manager.save(Transaction, transactionB);

      // save transactions
      await queryRunner.commitTransaction();

      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
