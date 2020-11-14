import {
  BaseEntity,
  Column,
  CreateDateColumn,
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

  @Column({ default: 0.0, type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
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

  @Column({ nullable: true })
  accountId: number;

  @ManyToOne(
    () => CreditCard,
    creditCard => creditCard.transactions,
    { nullable: true },
  )
  creditCard: CreditCard;

  @Column({ nullable: true })
  creditCardId: number;
}
