import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column('boolean')
    isCompany: boolean;

    @Column({nullable: true})
    companyName: string;

    @Column({nullable: true})
    firstName: string;

    @Column({nullable: true})
    lastName: string;

    @Column('boolean', {default: false})
    isAdmin: boolean;

    @Column({nullable: true, default: null})
    apikey: string;
}
