import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ProductService} from "./product.service";
import {ProductDto} from "./dto/product.dto";
import {Create_productDto} from "./dto/create_product.dto";

@Controller('product')
export class ProductController {
    constructor(private readonly productService : ProductService) {}

    //default on page load, sort all content by title from [A - Z]
    @Get()
    async getAllProducts() {
        return this.getAllProductsSortBy("title","asc");
    }

    //pure sorting of all products (sorting only)
    @Get("/sort_by/:category/order_by/:sort_order")
    async getAllProductsSortBy(
        @Param("category") category : string,
        @Param("sort_order") sort_order : string) {
        const query = { order : {}};
        const column_name = category === "name" ? "name" : "price";
        query.order[column_name] = sort_order.toUpperCase() === "DESC" ? 'DESC' : 'ASC';
        return this.productService.getManyProductBy(query);
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
