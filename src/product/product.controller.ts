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
import {Between, FindOperator, MoreThan, MoreThanOrEqual} from "typeorm";
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
    @Get("/sortby")
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
    @Get('/filterby_id/:id')
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

    @ApiOperation({
        summary: 'Get Products by filtering price + sorting',
        description: `
        get products by filtering price (within min - max range) or (>= min) or (<= max) then sorting \n
        {minprice} - OPTIONAL PARAMETER, query will still work w/o min price input\n
        {maxprice} - OPTIONAL PARAMETER, query will still work w/o max price input\n
        {orderby_name} - OPTIONAL PARAMETER, query will still work even w/o processing (min or max price or both)\n
        {orderby_price} - OPTIONAL PARAMETER, query will still work even w/o processing (min or max price or both)\n
        if orderby name + price is used, it will sort by name first then price second
        `,
    })
    @ApiQuery({
        name: "minprice",
        description: "minimum price - cannot be less than 0",
        required: false,
    })
    @ApiQuery({
        name: "maxprice",
        description: "maximum price - cannot be more than 9999",
        required: false,
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
        description: 'Displays a list of all the products from the database with price filter(s) + sorted by choice(s) selected',
        type: [ProductDTO],
    })
    @ApiResponse({
        status: 400,
        description: "ERROR - Min price greater than or equal to Max Price.",
    })
    @ApiResponse({
        status: 404,
        description: "No Product(s) found.",
    })
    @Get("/filterby_price")
    async getProducsByMinAndMaxPrice(
        @Query('minprice') minPrice ?: number,
        @Query('maxprice') maxprice ?: number,
        @Query("orderby_name") orderby_name ?: string,
        @Query("orderby_price") orderby_price ?: string) {
        const query = {order : {}};
        const validate = ProductUtil.verifyMinMaxValueError(minPrice,maxprice);
        orderby_name = ProductUtil.validateUndefined(orderby_name);
        orderby_price = ProductUtil.validateUndefined(orderby_price);
        //verify if where clause required to be implemented - NO ERROR will be successfully implemented
        if(validate === ProductUtil.NO_ERROR) {
            const myFunctionQuery: FindOperator<number> = ProductUtil.defineMinMaxValueFunction(minPrice,maxprice);
            query['where'] = [{price : myFunctionQuery }];
        }
        else if(validate === ProductUtil.ERROR_OVERLAPPINGPRICES) {
            const errorMsg = "ERROR - Min price greater than or equal to Max Price.";
            throw new HttpException(
                errorMsg,
                HttpStatus.BAD_REQUEST
            );
        }
        //add sort by - name
        if(orderby_name !== ""){
            query.order["name"] = orderby_name.toUpperCase() === "DESC" ? 'DESC' : 'ASC';
        }
        //add sort by - price
        if(orderby_price !== ""){
            query.order["price"] = orderby_price.toUpperCase() === "DESC" ? 'DESC' : 'ASC';
        }

        //execute query
        const result = await this.productService.getManyProductBy(query);
        if(result !== null) {
            return result;
        }
        else {
            const errorMsg = "No Product(s) found.";
            throw new HttpException(
                errorMsg,
                HttpStatus.NOT_FOUND
            );
        }
    }

}
