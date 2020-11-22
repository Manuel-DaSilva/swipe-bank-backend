import {
  Body,
  Controller,
  Get,
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
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('shops')
@Controller('shops')
@UseGuards(AuthGuard())
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @ApiExcludeEndpoint()
  @Post()
  createShop(
    @Body(ValidationPipe) createShopDto: CreateShopDto,
    @GetUser() user: User,
  ): Promise<Shop> {
    return this.shopsService.createShop(user, createShopDto);
  }
  @ApiExcludeEndpoint()
  @Get()
  getShops(@GetUser() user: User): Promise<Shop[]> {
    return this.shopsService.getShops(user);
  }
}
