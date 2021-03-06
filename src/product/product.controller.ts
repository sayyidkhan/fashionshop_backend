import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query} from '@nestjs/common';
import {ProductService} from "./product.service";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {ProductDTO} from "./dto/productDTO";
import {CreateProductDTO} from "./dto/createProductDTO";
import {ProductUtil} from "../commonUtil/productUtil";
import {FindOperator, Like} from "typeorm";

const config = require( 'config');

@ApiBearerAuth()
@ApiTags(config.swaggerOptions.product_api)
@Controller('product')
export class ProductController {
    constructor(private readonly productService : ProductService) {}

    static NO_PRODUCT_FOUND = "No Product(s) found";
    static INVALID_INPUT = "Invalid Input";
    static INVALID_PRICERANGE = "ERROR - Min price greater than or equal to Max Price.";


    @ApiOperation({
        summary: 'Get All Products',
        description: `
         Get all the records w/o sorting or any pagination involved
        
         No parameters are required to be passed in order to use this api
        `,
    })
    @ApiResponse({
        status: 200,
        description: 'Displays a list of all the products from the database sorted by title from [A - Z]',
        type: [ProductDTO],
    })
    @ApiResponse({
        status: 404,
        description: ProductController.NO_PRODUCT_FOUND,
    })
    @Get()
    async getAllProducts(): Promise<Promise<ProductDTO[]>> {
        const result: ProductDTO[] = await this.getProductsByCategoryAndSortBy("asc");
        return result;
    }

    @ApiOperation({
        summary: 'Insert a new Product listing',
        description: `
        Insert a new Product Object that needs to be added to the product listing.
         
        No parameters required to be passed.
        `,
    })
    @ApiBody({ type: CreateProductDTO })
    @ApiResponse({
        status: 201,
        description: 'Product successfully created.',
        type: ProductDTO,
    })
    @ApiResponse({
        status: 400,
        description: ProductController.INVALID_INPUT,
    })
    @Post()
    async createNewProduct(@Body() productDto : CreateProductDTO) {
        const new_product = await this.productService.createNewProduct(productDto);
        if(new_product !== null) {
            const result = new ProductDTO(new_product.id,new_product.name,new_product.description,new_product.price);
            return result;
        }
        const errorMsg = ProductController.INVALID_INPUT;
        throw new HttpException(
            errorMsg,
            HttpStatus.BAD_REQUEST
        );
    }

    @ApiOperation({
        summary: 'Get All Products + Sorting',
        description: `
        Get all the records + allows single or multiple sorting
        
        1.optional to pass {orderByName} -> if passed as PARAM_QUERY will sort based on possible values
        2.optional to pass {orderByPrice} -> if passed as PARAM_QUERY will sort based on possible values
        3.if multiple sort is specified, then it will be sorted by name then price.
        4. if other values is provided to orderByName / orderByPrice, it will disregard the value and sort it in asc
        `,
    })
    @ApiQuery({
        name: "orderByName",
        description: "sorting order -> possible values: ( asc / desc )",
        required: false,
        enum: ["asc","desc"]
    })
    @ApiQuery({
        name: "orderByPrice",
        description: "sorting order -> possible values: ( asc / desc )",
        required: false,
        enum: ["asc","desc"]
    })
    @ApiResponse({
        status: 200,
        description: 'Displays a list of all the products from the database sorted by choice(s) selected',
        type: [ProductDTO],
    })
    @ApiResponse({
        status: 404,
        description: ProductController.NO_PRODUCT_FOUND + ", No Record in database.",
    })
    @Get("/sortby")
    async getProductsByCategoryAndSortBy(
        @Query("orderByName") orderByName ?: string,
        @Query("orderByPrice") orderByPrice ?: string) {
        orderByName = ProductUtil.validateUndefined(orderByName);
        orderByPrice = ProductUtil.validateUndefined(orderByPrice);
        const query = { order : {}};
        if(orderByName !== ""){
            query.order["name"] = orderByName.toUpperCase() === "DESC" ? 'DESC' : 'ASC';
        }
        if(orderByPrice !== ""){
            query.order["price"] = orderByPrice.toUpperCase() === "DESC" ? 'DESC' : 'ASC';
        }
        const result = await this.productService.getManyProductBy(query);
        if(result !== null) {
            return result;
        }
        else {
            throw new HttpException(
                ProductController.NO_PRODUCT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

    }

    @ApiOperation({
        summary: 'Get One Product by ID only',
        description: `
        get one product by ID, only numbers(integer) are accepted.
        
        if product id does not exist will return a 404 error.
        currently data preparation ID (1 - 500) are valid records.
        ID 501 and above have not exist yet unless added.
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
        description: ProductController.NO_PRODUCT_FOUND,
    })
    @Get('/filterById/:id')
    async getProductById(@Param('id') _id: number) {
        const result: ProductDTO = await this.productService.getOneProduct({
            where : [{"id" : _id }]
        });
        if(result !== null) {
            return result;
        }
        const errorMsg = ProductController.NO_PRODUCT_FOUND;
        throw new HttpException(
            errorMsg,
            HttpStatus.NOT_FOUND
        );
    }

    @ApiOperation({
        summary: 'Get Products by filtering price + sorting',
        description: `
        get products by filtering price (within min - max range) or (>= min) or (<= max) then sorting
        
        1. {minprice} - OPTIONAL PARAMETER, query will still work w/o min price input
        2. {maxprice} - OPTIONAL PARAMETER, query will still work w/o max price input
        3. {orderByName} - OPTIONAL PARAMETER, query will still work even w/o processing (min or max price or both)
        4. {orderByPrice} - OPTIONAL PARAMETER, query will still work even w/o processing (min or max price or both)
        5. if orderby name + orderByPrice is used, it will sort by name first then price second
        6. if other values is provided to orderByName / orderByPrice, it will disregard the value and sort it in asc
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
        name: "orderByName",
        description: "sorting order -> possible values: ( asc / desc )",
        required: false,
        enum: ["asc","desc"]
    })
    @ApiQuery({
        name: "orderByPrice",
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
        description: ProductController.INVALID_PRICERANGE,
    })
    @ApiResponse({
        status: 404,
        description: ProductController.NO_PRODUCT_FOUND,
    })
    @Get("/filterByPrice")
    async getProductByMinAndMaxPrice(
        @Query('minprice') minPrice ?: number,
        @Query('maxprice') maxprice ?: number,
        @Query("orderByName") orderByName ?: string,
        @Query("orderByPrice") orderByPrice ?: string) {
        const query = {order : {}};
        const validate = ProductUtil.verifyMinMaxValueError(minPrice,maxprice);
        orderByName = ProductUtil.validateUndefined(orderByName);
        orderByPrice = ProductUtil.validateUndefined(orderByPrice);
        //verify if where clause required to be implemented - NO ERROR will be successfully implemented
        if(validate === ProductUtil.NO_ERROR) {
            const myFunctionQuery: FindOperator<number> = ProductUtil.defineMinMaxValueFunction(minPrice,maxprice);
            query['where'] = [{price : myFunctionQuery }];
        }
        else if(validate === ProductUtil.ERROR_OVERLAPPINGPRICES) {
            const errorMsg = ProductController.INVALID_PRICERANGE;
            throw new HttpException(
                errorMsg,
                HttpStatus.BAD_REQUEST
            );
        }
        //add sort by - name
        if(orderByName !== ""){
            query.order["name"] = orderByName.toUpperCase() === "DESC" ? 'DESC' : 'ASC';
        }
        //add sort by - price
        if(orderByPrice !== ""){
            query.order["price"] = orderByPrice.toUpperCase() === "DESC" ? 'DESC' : 'ASC';
        }

        //execute query
        const result = await this.productService.getManyProductBy(query);
        if(result !== null) {
            return result;
        }
        else {
            const errorMsg = ProductController.NO_PRODUCT_FOUND;
            throw new HttpException(
                errorMsg,
                HttpStatus.NOT_FOUND
            );
        }
    }

    @ApiOperation({
        summary: 'Get Products by filtering name + sorting',
        description: `
        get products by filtering name using the like clause + sorting
        
        1. {name} - REQUIRED PARAMETER, query will search for name of product and returns the product name which has the text name in it
        2. {orderByName} - OPTIONAL PARAMETER, query will sort by name
        3. {orderByPrice} - OPTIONAL PARAMETER, query will sort by price
        4. if orderby name + orderByPrice is used, it will sort by name first then price second
        5. if other values is provided to orderByName / orderByPrice, it will disregard the value and sort it in asc
        `,
    })
    @ApiParam({
        name: "name",
        description: "name of the product -> will be filtered using like clause",
    })
    @ApiQuery({
        name: "orderByName",
        description: "sorting order -> possible values: ( asc / desc )",
        required: false,
        enum: ["asc","desc"]
    })
    @ApiQuery({
        name: "orderByPrice",
        description: "sorting order -> possible values: ( asc / desc )",
        required: false,
        enum: ["asc","desc"]
    })
    @ApiResponse({
        status: 200,
        description: 'Displays a list of all the products from the database with name filter(s) + sorted by choice(s) selected',
        type: [ProductDTO],
    })
    @ApiResponse({
        status: 404,
        description: ProductController.NO_PRODUCT_FOUND,
    })
    @Get("/filterByName/:name")
    async getProductByName(
        @Param('name') _name : string,
        @Query("orderByName") orderByName ?: string,
        @Query("orderByPrice") orderByPrice ?: string) {
        const query = {order : {}};
        orderByName = ProductUtil.validateUndefined(orderByName);
        orderByPrice = ProductUtil.validateUndefined(orderByPrice);

        query['where'] = [{name : Like("%" + _name + "%") }];

        //add sort by - name
        if(orderByName !== ""){
            query.order["name"] = orderByName.toUpperCase() === "DESC" ? 'DESC' : 'ASC';
        }
        //add sort by - price
        if(orderByPrice !== ""){
            query.order["price"] = orderByPrice.toUpperCase() === "DESC" ? 'DESC' : 'ASC';
        }

        //execute query
        const result = await this.productService.getManyProductBy(query);
        if(result !== null) {
            return result;
        }
        else {
            const errorMsg = ProductController.NO_PRODUCT_FOUND;
            throw new HttpException(
                errorMsg,
                HttpStatus.NOT_FOUND
            );
        }
    }

}
