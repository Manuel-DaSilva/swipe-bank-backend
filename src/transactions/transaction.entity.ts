import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionType } from './transaction-type.enum';
import { TransactionNature } from './transaction-nature.enum';
import { Account } from '../accounts/account.entity';
import { CreditCard } from '../credit-cards/credit-card.entity';
@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  ref: string;

  @Column()
  type: TransactionType;

  @Column()
  amount: number;

  @Column({ type: Date })
  date: Date;

  @Column()
  mesage: string;

  @Column()
  nature: TransactionNature;

  @ManyToOne(
    () => Account,
    account => account.transactions,
    { nullable: true },
  )
  account: Account;

  @Column()
  accountId: number;

  @ManyToOne(
    () => CreditCard,
    creditCard => creditCard.transactions,
    { nullable: true },
  )
  creditCard: CreditCard;

  @Column()
  creditCardId: number;
}
