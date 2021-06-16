import { Injectable } from '@nestjs/common';
import {Product} from "./entity/product.entity";
import {FindManyOptions, Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {ProductDTO} from "./dto/productDTO";
import {CreateProductDTO} from "./dto/createProductDTO";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>
    ) {
    }

    private mapToProductDTO(products: Product[]) {
        if(products.length !== 0){
            const result: ProductDTO[] = products.map((product: Product) =>
                new ProductDTO(
                    product.id,
                    product.name,
                    product.description,
                    parseFloat(product.price.toString())
                )
            );
            return result;
        }
        return null;
    }

    async getManyProductBy(query: FindManyOptions<Product>) : Promise<ProductDTO[]> {
        const products: Product[] = await this.productRepository.find(query);
        if(products === undefined || products === null){
            return null;
        }
        const result: ProductDTO[] = this.mapToProductDTO(products);
        return result;
    }


    async getOneProduct(query: FindManyOptions<Product>) : Promise<ProductDTO> {
        const product: Product = await this.productRepository.findOne(query);
        if(product === undefined || product === null){
            return null;
        }
        const result: ProductDTO = new ProductDTO(
            product.id,
            product.name,
            product.description,
            parseFloat(product.price.toString())
        );
        return result;
    }

    async createNewProduct(productDto : CreateProductDTO) : Promise<Product> {
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
