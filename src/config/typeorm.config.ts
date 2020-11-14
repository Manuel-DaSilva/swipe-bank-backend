import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'us-cdbr-east-02.cleardb.com',
  port: 3306,
  username: 'b16568810451fd',
  password: '50d2e785',
  database: 'heroku_63f296c9578f35a',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
