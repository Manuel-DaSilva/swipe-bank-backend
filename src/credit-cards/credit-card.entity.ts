import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreditCardStatus } from './credit-card-status.enum';
import { Transaction } from '../transactions/transaction.entity';
@Entity()
export class CreditCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  expirationDate: Date;

  @Column()
  number: string;

  @Column()
  name: string;

  @Column()
  securityCode: number;

  @Column({ default: 0, type: 'real' })
  balance: number;

  @Column()
  limit: number;

  @Column()
  status: CreditCardStatus;

  @ManyToOne(
    () => User,
    user => user.creditCards,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;

  @OneToMany(
    () => Transaction,
    transaction => transaction.creditCard,
  )
  transactions: Transaction[];
}
