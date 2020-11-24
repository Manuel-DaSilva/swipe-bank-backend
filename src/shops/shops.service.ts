import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { ShopRepository } from './shop.repository';
import { Shop } from './shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(ShopRepository)
    private shopRepository: ShopRepository,
    private accountsService: AccountsService,
  ) {}

  async createShop(user: User, createShopDto: CreateShopDto): Promise<Shop> {
    // create an account
    const account = await this.accountsService.createAccount(user);
    // create apikey
    return this.shopRepository.createAccount(user, account, createShopDto);
  }

  async getShopByApiKey(apiKey: string): Promise<Shop> {
    return this.shopRepository.findOne({ apiKey });
  }

  getShops(user: User) {
    return this.shopRepository.find({ userId: user.id });
  }

  getShopById(id: number, user: User): Promise<Shop> {
    return this.shopRepository.findOne({
      id,
      userId: user.id,
    });
  }
}
