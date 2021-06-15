import {ApiProperty} from "@nestjs/swagger";

export class CreateProductDTO {

    constructor(name: string, description: string, price: number) {
        this.name = name;
        this.description = description;
        this.price = price;
    }

    @ApiProperty()
    name : string;
    @ApiProperty()
    description : string;
    @ApiProperty()
    price : number;
}