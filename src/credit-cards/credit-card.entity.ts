import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreditCardStatus } from './credit-card-status.enum';

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

  @Column({ default: 0 })
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
}
