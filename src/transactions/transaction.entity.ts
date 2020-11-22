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
import { ColumnNumericTransformer } from 'src/utils/column-numeric-transformer.class';
@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  ref: string;

  @Column()
  type: TransactionType;

  @Column('decimal', {
    precision: 15,
    scale: 2,
    transformer: ColumnNumericTransformer,
  })
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
    { nullable: true, eager: false },
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
