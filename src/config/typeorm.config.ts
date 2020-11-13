import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  port: 5432,
  // host: 'ec2-52-87-22-151.compute-1.amazonaws.com',
  // username: 'ucevsekqqqpggk',
  // password: 'f3ad1e475a1e5977efac1e7a5a9fd986531e5ca034116dd83a24efea0cd16584',
  // database: 'da1nv2of96pf5d',
  // ssl: { rejectUnauthorized: false },
  host: '0.0.0.0',
  username: 'postgres',
  password: 'admin',
  database: 'swipebank',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
