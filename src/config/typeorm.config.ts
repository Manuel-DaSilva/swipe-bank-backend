import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  port: 3306,
  // host: 'swipebank.ckwjmsekfgmt.us-east-2.rds.amazonaws.com',
  // username: 'admin',
  // password: 'devSwipebank1234567',
  // database: 'swipebank',
  host: 'localhost',
  username: 'root',
  password: 'admin',
  database: 'swipebank-dev',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  // connectTimeout: 100000,
};
