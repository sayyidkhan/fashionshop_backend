import { ApiProperty } from '@nestjs/swagger';

export class ProductDTO {

    constructor(id: number, name: string, description: string, price: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
    }

    @ApiProperty({
        description : "the ID of the product",
    })
    id : number;
    @ApiProperty({
        description : "the title of the product",
    })
    name : string;
    @ApiProperty({
        description : "the description describing the category of the product which it falls under",
    })
    description : string;
    @ApiProperty({
        description : "the price of the product",
        minimum : 0,
        default: 0,
    })
    price : number;
}