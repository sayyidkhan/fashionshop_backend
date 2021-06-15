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
        if(products !== null && products !== undefined){
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

    async getAllProducts(): Promise<ProductDTO[]> {
        const products: Product[] = await this.productRepository.find();
        if(products !== undefined){
            const result: ProductDTO[] = this.mapToProductDTO(products);
            return result;
        }
        return null;
    }

    async getManyProductBy(query: FindManyOptions<Product>) : Promise<ProductDTO[]> {
        const products: Product[] = await this.productRepository.find(query);
        if(products !== undefined){
            const result: ProductDTO[] = this.mapToProductDTO(products);
            return result;
        }
        return null;
    }


    async getOneProduct(query: FindManyOptions<Product>) : Promise<ProductDTO> {
        const product: Product = await this.productRepository.findOne(query);
        if(product !== undefined) {
            const result: ProductDTO = new ProductDTO(
                product.id,
                product.name,
                product.description,
                parseFloat(product.price.toString())
            );
            return result;
        }
        return null;
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
