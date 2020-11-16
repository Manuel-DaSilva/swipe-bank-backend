import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountsService } from './accounts.service';
import { Account } from './account.entity';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { WithdrawDto } from './dto/withdraw.dto';
import { OperationResponse } from './response/operationResponse.class';

@Controller('accounts')
@UseGuards(AuthGuard())
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @ApiExcludeEndpoint()
  @Post()
  createAccount(@GetUser() user: User): Promise<Account> {
    return this.accountsService.createAccount(user);
  }

  @ApiExcludeEndpoint()
  @Get()
  gerAccounts(@GetUser() user: User): Promise<Account[]> {
    return this.accountsService.getAccounts(user);
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  closeAccount(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.accountsService.closeAccount(id, user);
  }

  @ApiExcludeEndpoint()
  @Post('withdraw')
  @HttpCode(200)
  withdraw(
    @GetUser() user: User,
    @Body(ValidationPipe) withDrawDto: WithdrawDto,
  ): Promise<OperationResponse> {
    return this.accountsService.withdraw(user, withDrawDto);
  }

  @ApiExcludeEndpoint()
  @Post('deposit')
  deposit(): Promise<void> {
    return null;
  }
}
