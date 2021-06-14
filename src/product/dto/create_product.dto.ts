export class Create_productDto {

    constructor(name: string, description: string, price: number) {
        this.name = name;
        this.description = description;
        this.price = price;
    }

    name : string;
    description : string;
    price : number;
}