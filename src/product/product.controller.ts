import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query} from '@nestjs/common';
import {ProductService} from "./product.service";
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {ProductDTO} from "./dto/productDTO";
import {CreateProductDTO} from "./dto/createProductDTO";
import {ProductUtil} from "../commonUtil/productUtil";
const config = require( 'config');

@ApiBearerAuth()
@ApiTags(config.swaggerOptions.product_api)
@Controller('product')
export class ProductController {
    constructor(private readonly productService : ProductService) {}


    @ApiOperation({
        summary: 'Get All Products',
        description: "No parameters are required to be passed in order to use this api",
    })
    @ApiResponse({
        status: 200,
        description: 'Displays a list of all the products from the database sorted by title from [A - Z] & price from lowest to highest',
        type: [ProductDTO],
    })
    @ApiResponse({
        status: 400,
        description: "No record found",
    })
    @Get()
    async getAllProducts(): Promise<Promise<ProductDTO[]>> {
        const result: ProductDTO[] = await this.getProductsByCategoryAndSortBy("asc");
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
        description: "Insert a new Product Object that needs to be added to the product listing, no parameters required to by passed.",
    })
    @ApiBody({ type: CreateProductDTO })
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

    @ApiOperation({
        summary: 'Get All Products + Sorting',
        description: `
        1.optional to pass {orderby_name} -> if passed as PARAM_QUERY will sort based on possible values\n
        2.optional to pass {orderby_price} -> if passed as PARAM_QUERY will sort based on possible values\n
        3.if multiple sort is specified, then it will be sorted by name then price.
        `,
    })
    @ApiQuery({
        name: "orderby_name",
        description: "sorting order -> possible values: ( asc / desc )",
        required: false,
        enum: ["asc","desc"]
    })
    @ApiQuery({
        name: "orderby_price",
        description: "sorting order -> possible values: ( asc / desc )",
        required: false,
        enum: ["asc","desc"]
    })
    @ApiResponse({
        status: 200,
        description: 'Displays a list of all the products from the database sorted by choice(s) selected',
        type: [ProductDTO],
    })
    @Get("/sort_by")
    async getProductsByCategoryAndSortBy(
        @Query("orderby_name") orderby_name ?: string,
        @Query("orderby_price") orderby_price ?: string) {
        orderby_name = ProductUtil.validateUndefined(orderby_name);
        orderby_price = ProductUtil.validateUndefined(orderby_price);
        const query = { order : {}};
        if(orderby_name !== ""){
            query.order["name"] = orderby_name.toUpperCase() === "DESC" ? 'DESC' : 'ASC';
        }
        if(orderby_price !== ""){
            query.order["price"] = orderby_price.toUpperCase() === "DESC" ? 'DESC' : 'ASC';
        }
        return this.productService.getManyProductBy(query);
    }

    @ApiOperation({
        summary: 'Get One Product by ID only',
        description: `
        get one product by ID, only numbers(integer) are accepted. if product id does not exist will return a 404 error.\n
        currently data preparation ID (1 - 500) are valid records.\n
        ID 501 and above have not exist yet unless added.\n
        can use the data based on the scenarios.
        `,
    })
    @ApiParam({
        name: "id",
        description: "any number from one to infinity -> possible values: ( 1 ... n )",
    })
    @ApiResponse({
        status: 200,
        description: 'Return 1 productDTO sucessfully which was searched by ID.',
        type: ProductDTO,
    })
    @ApiResponse({
        status: 404,
        description: "Product ID not found.",
    })
    @Get('/:id')
    async getProductById(@Param('id') _id: number) {
        const result: ProductDTO = await this.productService.getOneProduct({
            where : [{"id" : _id }]
        });
        if(result !== null) {
            return result;
        }
        const errorMsg = "Product ID not found.";
        throw new HttpException(
            errorMsg,
            HttpStatus.NOT_FOUND
        );
    }

}
