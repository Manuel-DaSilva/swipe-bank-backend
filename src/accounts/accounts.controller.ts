import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountsService } from './accounts.service';
import { Account } from './account.entity';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('accounts')
@UseGuards(AuthGuard())
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  createTask(@GetUser() user: User): Promise<Account> {
    return this.accountsService.createAccount(user);
  }

  @Get()
  getBanks(@GetUser() user: User): Promise<Account[]>{
    return this.accountsService.getAccounts(user);
  }
}
