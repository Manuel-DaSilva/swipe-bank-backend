import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Bank extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true, default: null})
    apiEndpoint: string;

    @Column({nullable: true, default: null})
    code: string;

    @Column({nullable: true, default: null})
    apiKey: string;
}
