import { IsUUID } from 'class-validator';
import { User } from 'src/auth/user.entity';
import { Account } from '../accounts/account.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @IsUUID()
  apiKey: string;

  @ManyToOne(
    () => User,
    user => user.shops,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;

  @OneToOne(() => Account, { eager: true })
  @JoinColumn()
  account: Account;

  @Column()
  accountId: number;
}
