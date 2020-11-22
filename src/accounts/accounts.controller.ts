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
import { OperationDto } from './dto/operation.dto';
import { OperationResponse } from './response/operationResponse.class';
import { Transaction } from 'src/transactions/transaction.entity';

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
  getAccounts(@GetUser() user: User): Promise<Account[]> {
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
    @Body(ValidationPipe) operationDto: OperationDto,
  ): Promise<OperationResponse> {
    return this.accountsService.withdraw(user, operationDto);
  }

  @ApiExcludeEndpoint()
  @Post('deposit')
  deposit(
    @GetUser() user: User,
    @Body(ValidationPipe) OperationDto: OperationDto,
  ): Promise<OperationResponse> {
    return this.accountsService.deposit(user, OperationDto);
  }

  @ApiExcludeEndpoint()
  @Get(':id/movements')
  getMovements(
    @Param('id') number: string,
    @GetUser() user: User,
  ): Promise<Account> {
    return this.accountsService.getMovements(number, user);
  }
}
