import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bank extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  apiEndPoint: string;

  @Column()
  code: string;

  @Column()
  serviceApiKey: string;

  @Column()
  swipeApiKey: string;
}
