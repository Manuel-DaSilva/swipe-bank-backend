import { Controller, Delete, Get, Post, UseGuards, Param } from '@nestjs/common';
import { CreditCardsService } from './credit-cards.service';
import { CreditCard } from './credit-card.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('credit-cards')
@UseGuards(AuthGuard())
export class CreditCardsController {
  constructor(private creditCardsService: CreditCardsService) {}

  @Post()
  createCreditCard(@GetUser() user: User): Promise<CreditCard> {
    return this.creditCardsService.createCard(user);
  }

  @Get()
  getAllCreditCards(@GetUser() user: User): Promise<CreditCard[]>{
    return this.creditCardsService.getAllCards(user);
  }

  @Delete(':id')
  closedCreditCard(@Param('id') id: number, @GetUser() user: User): Promise<void>{
    return this.creditCardsService.closeCard(id, user);
  }
}
