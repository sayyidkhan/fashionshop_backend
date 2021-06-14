import { Injectable } from '@nestjs/common';
import {Product} from "./entity/product.entity";
import {FindManyOptions, Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {ProductDto} from "./dto/product.dto";
import {Create_productDto} from "./dto/create_product.dto";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>
    ) {
    }

    async getAllProducts(): Promise<ProductDto[]> {
        const products: Product[] = await this.productRepository.find();
        const result: ProductDto[] = products.map((product: Product) =>
            new ProductDto(
                product.id,
                product.name,
                product.description,
                parseFloat(product.price.toString())
            )
        );
        return result;
    }

    async getManyProductBy(query: FindManyOptions<Product>) : Promise<ProductDto[]> {
        const products: Product[] = await this.productRepository.find(query);
        const result: ProductDto[] = products.map((product: Product) =>
            new ProductDto(
                product.id,
                product.name,
                product.description,
                parseFloat(product.price.toString())
            )
        );
        return result;
    }


    async getOneProduct(query: FindManyOptions<Product>) : Promise<ProductDto> {
        const product: Product = await this.productRepository.findOne(query);
        const result: ProductDto = new ProductDto(
                product.id,
                product.name,
                product.description,
                parseFloat(product.price.toString())
        );
        return result;
    }

    async createNewProduct(productDto : Create_productDto) : Promise<Product> {
        const name = productDto.name;
        const description = productDto.description;
        const price = productDto.price;
        return this.productRepository.save({
            name,
            description,
            price,
        });
    }


}
