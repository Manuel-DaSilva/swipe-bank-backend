import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  port: 3306,
  // host: 'us-cdbr-east-02.cleardb.com',
  // username: 'b16568810451fd',
  // password: '50d2e785',
  // database: 'heroku_63f296c9578f35a',
  host: 'localhost',
  username: 'root',
  password: 'admin',
  database: 'swipebank-dev',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
