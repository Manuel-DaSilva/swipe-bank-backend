import { IsUUID } from 'class-validator';
import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { AccountStatus } from './account-status.enum';

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

  @Column()
  userId: number;

  @ManyToOne(
    type => User,
    user => user.accounts,
    { eager: false },
  )
  user: User;
}
