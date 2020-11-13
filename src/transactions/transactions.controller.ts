import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './dto/transaction.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('transactions')
@UseGuards(AuthGuard())
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @ApiExcludeEndpoint()
  @Post('in-bank')
  inBankTransaction(
    @Body(ValidationPipe) transactionDto: TransactionDto,
    @GetUser() user: User,
  ) {
    return this.transactionsService.inBankTransaction(user, transactionDto);
  }
}
