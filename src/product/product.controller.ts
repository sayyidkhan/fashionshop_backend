import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ProductService} from "./product.service";
import {ProductDto} from "./dto/product.dto";
import {Create_productDto} from "./dto/create_product.dto";

@Controller('product')
export class ProductController {
    constructor(private readonly productService : ProductService) {}

    @Get()
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Get('/product_id/:id')
    async getProductById(@Param('id') _id: number) {
        return this.productService.getOneProduct({
           where : [{"id" : _id }]
        });
    }

    @Post()
    async createNewProduct(@Body() productDto : Create_productDto) {
        return this.productService.createNewProduct(productDto);
    }

}
