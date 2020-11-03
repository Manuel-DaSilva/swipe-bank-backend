import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ShopsService } from './shops.service';

@Controller('shops')
@UseGuards(AuthGuard())
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @Get()
  getShops(@GetUser() user: User) {
    return user;
  }
}
