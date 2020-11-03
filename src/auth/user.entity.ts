import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from './user-type.enum';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  type: UserType;

  @Column()
  fullName: string;

  @Column({ unique: true })
  dni: string;

  @Column()
  address: string;

  @Column()
  salt: string;

  @Column()
  password: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}
