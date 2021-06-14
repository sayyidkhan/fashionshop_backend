import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Product {
    constructor(id: number, name: string, description: string, price: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
    }

    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar',{length : 60 , nullable: false, default: ''})
    name : string;

    @Column('varchar',{length : 200, nullable: false, default : ''})
    description : string;

    @Column('decimal',{precision: 8, scale: 2, default : 0.00})
    price : number;
}