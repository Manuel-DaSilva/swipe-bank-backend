import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreditCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
