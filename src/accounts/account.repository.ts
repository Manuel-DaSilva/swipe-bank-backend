import { EntityRepository, Repository } from 'typeorm';
import { Account } from './account.entity';
import { v4 as uuidv4 } from 'uuid';
import { AccountStatus } from './account-status.enum';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  async createAccount(user: User): Promise<Account> {
    const account = new Account();

    account.number = uuidv4();
    account.balance = 0;
    account.status = AccountStatus.ACTIVE;
    account.user = user;

    try {
      await account.save();
      delete account.user;
      return account;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAccounts(user: User): Promise<Account[]>{
    const accounts = await Account.find({
      where: {
        userId: user.id,
        status: AccountStatus.ACTIVE
      }
    });
    return accounts;
  }
}
