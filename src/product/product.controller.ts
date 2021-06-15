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
        if(result.length !== 0) {
            return result;
        }
        const errorMsg = "No record found";
        throw new HttpException(
            errorMsg,
            HttpStatus.BAD_REQUEST
        );
    }

    @ApiOperation({
        summary: 'Insert a new Product listing',
        description: "Product Object that needs to be added to the product listing",
    })
    @ApiResponse({
        status: 201,
        description: 'Product successfully created.',
        type: ProductDTO,
    })
    @ApiResponse({
        status: 400,
        description: "Invalid Input",
    })
    @Post()
    async createNewProduct(@Body() productDto : CreateProductDTO) {
        const new_product = await this.productService.createNewProduct(productDto);
        if(new_product !== null) {
            const result = new ProductDTO(new_product.id,new_product.name,new_product.description,new_product.price);
            return result;
        }
        const errorMsg = "Invalid Input";
        throw new HttpException(
            errorMsg,
            HttpStatus.BAD_REQUEST
        );
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
