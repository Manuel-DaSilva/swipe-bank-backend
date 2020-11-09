import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from './user-type.enum';
import * as bcrypt from 'bcryptjs';
import { Account } from '../accounts/account.entity';
import { Shop } from 'src/shops/shop.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  type: UserType;

  @Column()
  fullName: string;

  @Column({ unique: true })
  dni: string;

  @Column()
  address: string;

  @Column()
  salt: string;

  @Column()
  password: string;

  // relations
  @OneToMany(
    () => Account,
    account => account.user,
    { eager: true },
  )
  accounts: Account[];

  @OneToMany(
    () => Shop,
    shop => shop.user,
    { eager: true },
  )
  shops: Shop[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}
