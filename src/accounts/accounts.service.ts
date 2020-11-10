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

  async getAccounts(user: User): Promise<Account[]>{
    return this.accountRepository.getAccounts(user);
  }
}
