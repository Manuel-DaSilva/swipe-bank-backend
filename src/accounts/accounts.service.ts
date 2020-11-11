import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { AccountRepository } from './account.repository';
import { Account } from './account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountRepository)
    private accountRepository: AccountRepository,
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
}
