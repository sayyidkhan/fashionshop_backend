import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar',{length : 60})
    name : string;

    @Column('varchar',{length : 500, default : ''})
    description : string;

    @Column('decimal',{default : 0.00})
    price : number;

}