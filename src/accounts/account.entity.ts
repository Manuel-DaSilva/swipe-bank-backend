import { IsUUID } from 'class-validator';
import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AccountStatus } from './account-status.enum';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsUUID()
  number: string;

  @Column({ default: 0 })
  balance: number;

  @Column()
  status: AccountStatus;

  @ManyToOne(
    () => User,
    user => user.accounts,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;

  @OneToMany(
    () => Transaction,
    transaction => transaction.account,
  )
  transactions: Transaction[];
}
