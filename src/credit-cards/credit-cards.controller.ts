import {
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CreditCardsService } from './credit-cards.service';
import { CreditCard } from './credit-card.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Transaction } from 'src/transactions/transaction.entity';

@Controller('credit-cards')
@UseGuards(AuthGuard())
export class CreditCardsController {
  constructor(private creditCardsService: CreditCardsService) {}

  @ApiExcludeEndpoint()
  @Post()
  createCreditCard(@GetUser() user: User): Promise<CreditCard> {
    return this.creditCardsService.createCard(user);
  }

  @ApiExcludeEndpoint()
  @Get()
  getAllCreditCards(@GetUser() user: User): Promise<CreditCard[]> {
    return this.creditCardsService.getAllCards(user);
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  closeCreditCard(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.creditCardsService.closeCard(id, user);
  }

  @ApiExcludeEndpoint()
  @Post()
  payment(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.creditCardsService.closeCard(id, user);
  }

  @Get(':id/movements')
  getMovements(
    @Param('id') number: string,
    @GetUser() user: User,
  ): Promise<Transaction[]> {
    return this.creditCardsService.getMovements(number, user);
  }
}
