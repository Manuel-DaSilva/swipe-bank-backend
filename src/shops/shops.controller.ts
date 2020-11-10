import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Shop } from './shop.entity';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';

@Controller('shops')
@UseGuards(AuthGuard())
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @Post()
  createShop(
    @Body(ValidationPipe) createShopDto: CreateShopDto,
    @GetUser() user: User,
  ): Promise<Shop> {
    return this.shopsService.createShop(user, createShopDto);
  }
}
