import { AccountStatus } from './account-status.enum';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { AccountRepository } from './account.repository';
import { Account } from './account.entity';
import { WithdrawDto } from './dto/withdraw.dto';
import { OperationResponse } from './response/operationResponse.class';
import { UtilsService } from '../utils/utils.service';
import { TransactionType } from 'src/transactions/transaction-type.enum';
import { TransactionNature } from 'src/transactions/transaction-nature.enum';
import { v4 as uuidv4 } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountRepository)
    private accountRepository: AccountRepository,
    private utilsService: UtilsService,
  ) {}

  async createAccount(user: User): Promise<Account> {
    return this.accountRepository.createAccount(user);
  }

  async getAccounts(user: User): Promise<Account[]> {
    return this.accountRepository.getAccounts(user);
  }

  async getAccountById(accountId: number): Promise<Account> {
    return this.accountRepository.findOne(accountId);
  }

  async getAccountByNumber(accountNumber: string): Promise<Account> {
    return this.accountRepository.findOne({ number: accountNumber });
  }

  async closeAccount(id: number, user: User): Promise<void> {
    return this.accountRepository.closeAccount(id, user);
  }

  async withdraw(
    user: User,
    withdrawDto: WithdrawDto,
  ): Promise<OperationResponse> {
    const account = await this.accountRepository.findOne({
      userId: user.id,
      number: withdrawDto.accountNumber,
      status: AccountStatus.ACTIVE,
    });

    if (!account) {
      throw new BadRequestException('Invalid account');
    }

    if (account.balance >= withdrawDto.amount) {
      // do withdraw
      const result = account.balance - withdrawDto.amount;
      account.balance = result;
      await account.save();
      const withdrawRef = uuidv4();
      const transaction = this.utilsService.generateTransaction(
        null,
        account.id,
        TransactionType.WITHDRAW,
        TransactionNature.DEBIT,
        withdrawRef,
        '',
        withdrawDto.amount,
      );
      await transaction.save();
      const successOperation: OperationResponse = {
        amount: withdrawDto.amount,
      };

      return successOperation;
    } else {
      throw new ConflictException('Invalid amount');
    }
  }

  async deposit(
    user: User,
    withdrawDto: WithdrawDto,
  ): Promise<OperationResponse> {
    const account = await this.accountRepository.findOne({
      userId: user.id,
      number: withdrawDto.accountNumber,
      status: AccountStatus.ACTIVE,
    });

    if (!account) {
      throw new BadRequestException('Invalid account');
    }

    try {
      const result = account.balance + withdrawDto.amount;
      account.balance = result;
      await account.save();
      const depositRef = uuidv4();
      const transaction = this.utilsService.generateTransaction(
        null,
        account.id,
        TransactionType.DEPOSIT,
        TransactionNature.CREDIT,
        depositRef,
        '',
        withdrawDto.amount,
      );
      await transaction.save();
      const successOperation: OperationResponse = {
        amount: withdrawDto.amount,
      };

      return successOperation;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
