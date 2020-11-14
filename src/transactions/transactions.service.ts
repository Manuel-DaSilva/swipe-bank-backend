import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { User } from '../auth/user.entity';
import { TransactionDto } from './dto/transaction.dto';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/account.entity';
import { Connection } from 'typeorm';
import { UtilsService } from 'src/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';
import { TransactionType } from './transaction-type.enum';
import { TransactionNature } from './transaction-nature.enum';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionRepository)
    private transactionRepository: TransactionRepository,
    private accountsService: AccountsService,
    private connection: Connection,
    private utilsService: UtilsService,
  ) {}

  async inBankTransaction(user: User, transactionDto: TransactionDto) {
    const fromAccount = await this.accountsService.getAccountByNumber(
      transactionDto.fromAccountNumber,
    );
    const toAccount = await this.accountsService.getAccountByNumber(
      transactionDto.toAccountNumber,
    );

    if (!fromAccount && fromAccount.userId !== user.id) {
      // TODO change badrequest to correct response
      throw new BadRequestException(
        'Invalid transaction, account doesnt belongs to the user',
      );
    }

    if (!this.isTransactionValid(fromAccount, transactionDto.amount)) {
      // TODO change badrequest to correct response
      throw new BadRequestException(
        'Invalid transaction, insufficient balance',
      );
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // unique transaction reference
      const transactionRef = uuidv4();

      // updating account
      await queryRunner.manager.update(Account, toAccount.id, {
        balance: toAccount.balance + transactionDto.amount,
      });

      // creating credit transaction
      const transactionA = this.utilsService.generateTransaction(
        null,
        toAccount.id,
        TransactionType.TRANSFER,
        TransactionNature.CREDIT,
        transactionRef,
        transactionDto.description,
        transactionDto.amount,
      );
      await queryRunner.manager.save(Transaction, transactionA);

      // updating creditCard
      await queryRunner.manager.update(Account, fromAccount.id, {
        balance: fromAccount.balance - transactionDto.amount,
      });

      // creating debit transaction
      const transactionB = this.utilsService.generateTransaction(
        null,
        fromAccount.id,
        TransactionType.TRANSFER,
        TransactionNature.DEBIT,
        transactionRef,
        transactionDto.description,
        transactionDto.amount,
      );
      await queryRunner.manager.save(Transaction, transactionB);

      await queryRunner.commitTransaction();
      // TODO change payment response
      return 'Transaction successfull';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  private isTransactionValid(fromAccount: Account, amount: number) {
    return fromAccount.balance >= amount;
  }
}
