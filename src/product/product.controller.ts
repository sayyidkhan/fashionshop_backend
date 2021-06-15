import {Body, Controller, Get, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {ProductService} from "./product.service";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {ProductDTO} from "./dto/productDTO";
import {CreateProductDTO} from "./dto/createProductDTO";
const config = require( 'config');

@ApiBearerAuth()
@ApiTags(config.swaggerOptions.product_api)
@Controller('product')
export class ProductController {
    constructor(private readonly productService : ProductService) {}


    @ApiOperation({
        summary: 'Get All Products from the database',
        description: "No parameters are required to be passed in order to use this api",
    })
    @ApiResponse({
        status: 200,
        description: 'Displays a list of all the products from the database sorted by title from [A - Z].',
        type: [ProductDTO],
    })
    @ApiResponse({
        status: 400,
        description: "No record found",
    })
    @Get()
    async getAllProducts(): Promise<Promise<ProductDTO[]>> {
        const result: ProductDTO[] = await this.getAllProductsSortBy("name","asc");
        if(result.length === 0) {
            const errorMsg = "No record found";
            throw new HttpException(
                errorMsg,
                HttpStatus.BAD_REQUEST
            );
        }
        return result;
    }

    @Post()
    async createNewProduct(@Body() productDto : CreateProductDTO) {
        return this.productService.createNewProduct(productDto);
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


}
