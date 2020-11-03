import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ShopsModule } from './shops/shops.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule, ShopsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
