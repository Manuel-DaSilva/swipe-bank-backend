import { Account } from './../accounts/account.entity';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Shop } from './shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@EntityRepository(Shop)
export class ShopRepository extends Repository<Shop> {
  async createAccount(
    user: User,
    account: Account,
    createShopDto: CreateShopDto,
  ): Promise<Shop> {
    const shop = new Shop();
    shop.name = createShopDto.name;
    shop.apiKey = uuidv4();
    shop.user = user;
    shop.account = account;
    try {
      await shop.save();
      return this.findOne(shop.id);
    } catch (e) {
      console.log(e);

      throw new InternalServerErrorException();
    }
  }
}
