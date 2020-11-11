import { EntityRepository, Repository } from 'typeorm';
import { Account } from './account.entity';
import { v4 as uuidv4 } from 'uuid';
import { AccountStatus } from './account-status.enum';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { userInfo } from 'os';

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

  async closeAccount(id: number, user: User): Promise<void>{
    let account = await Account.findOne({
      where: {
        id,
        userId: user.id
      }
    });
    console.log(account);
    if(account){
      account.status = AccountStatus.CLOSED;
      await account.save();
    }else{
      throw new NotFoundException('Account not found.');
    }
  }
}
