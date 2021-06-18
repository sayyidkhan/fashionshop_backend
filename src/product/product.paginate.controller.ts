import {ProductService} from "./product.service";
import {Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Param, ParseIntPipe, Query} from "@nestjs/common";
import {ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {ProductController} from "./product.controller";
import {PaginationUtil} from "../commonUtil/paginationUtil";
import {PaginationProductDTO} from "./dto/PaginationProductDTO";

const config = require( 'config');

@ApiBearerAuth()
@ApiTags(config.swaggerOptions.pagination_api)
@Controller('product/pg')
export class ProductPaginateController {
    constructor(private readonly productService : ProductService) {}

    static PAGE_NO_EXCEED =  "ERROR: Page number query exceeds available page range.";

    paginateRecords(products : any[], _currentPage : number, _itemPerPage : number) {
        if(products !== null) {
            let result;
            try {
                result = PaginationUtil.getPaginatedList(products,_currentPage,_itemPerPage);
            }
            catch (e) {
                result = null;
                throw new HttpException(
                    ProductPaginateController.PAGE_NO_EXCEED,
                    HttpStatus.BAD_REQUEST
                );
            }
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
        summary: 'Get All Products using Pagination',
        description: `
        Get all the records with pagination queries which required to be passed.
        
        1.required QUERY_PARAM {currentPage} -> specify the current page
        2.required QUERY_PARAM {itemPerPage} -> specify the max item per page
        Available metadata returned: (currentPage, itemPerPage, totalItems, totalPages)
        returns a list of ProductDTO object for the current page selected
        `,
    })
    @ApiQuery({
        name: "currentPage",
        description: "specify which page to retrieve",
    })
    @ApiQuery({
        name: "itemPerPage",
        description: "specify max number of items per page -> (min: 10, max: 50)",
    })
    @ApiResponse({
        status: 200,
        description: 'Displays a list of all the products in PaginationProductDTO sorted by title from [A - Z]4',
        type: [PaginationProductDTO],
    })
    @ApiResponse({
        status: 400,
        description: ProductPaginateController.PAGE_NO_EXCEED,
    })
    @ApiResponse({
        status: 404,
        description: ProductController.NO_PRODUCT_FOUND,
    })
    @Get('')
    async getAllProducts(
        @Query('currentPage', new DefaultValuePipe(1), ParseIntPipe) _currentPage: number = 1,
        @Query('itemPerPage', new DefaultValuePipe(50), ParseIntPipe) _itemPerPage: number = 50,
    ): Promise<PaginationProductDTO> {
        const products = await new ProductController(this.productService).getAllProducts();
        const result: PaginationProductDTO = this.paginateRecords(products,_currentPage,_itemPerPage);
        return result;
    }

    @ApiOperation({
        summary: 'Get All Products + Sorting with Pagination',
        description: `
        Get all the records with pagination queries which required to be passed with optional sorting param query to be passed.
        
        ####### Required Parameters #########
        1.required QUERY_PARAM {currentPage} -> specify the current page
        2.required QUERY_PARAM {itemPerPage} -> specify the max item per page
        Available metadata returned: (currentPage, itemPerPage, totalItems, totalPages)
        returns a list of ProductDTO object for the current page selected
        
        ####### Optional Parameters #########
        3.optional to pass {orderByName} -> if passed as PARAM_QUERY will sort based on possible values
        4.optional to pass {orderByPrice} -> if passed as PARAM_QUERY will sort based on possible values
        5.if multiple sort is specified, then it will be sorted by name then price.
        6.if other values is provided to orderByName / orderByPrice, it will disregard the value and sort it in asc
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
    @ApiQuery({
        name: "currentPage",
        description: "specify which page to retrieve",
    })
    @ApiQuery({
        name: "itemPerPage",
        description: "specify max number of items per page -> (min: 10, max: 50)",
    })
    @ApiResponse({
        status: 200,
        description: 'Displays a list of all the products from the database sorted by choice(s) selected',
        type: [PaginationProductDTO],
    })
    @ApiResponse({
        status: 400,
        description: ProductPaginateController.PAGE_NO_EXCEED,
    })
    @ApiResponse({
        status: 404,
        description: ProductController.NO_PRODUCT_FOUND + ", No Record in database.",
    })
    @Get("sortby")
    async getProductsByCategoryAndSortBy(
        @Query("orderByName") orderByName ?: string,
        @Query("orderByPrice") orderByPrice ?: string,
        @Query('currentPage', new DefaultValuePipe(1), ParseIntPipe) _currentPage: number = 1,
        @Query('itemPerPage', new DefaultValuePipe(50), ParseIntPipe) _itemPerPage: number = 50,
    ): Promise<PaginationProductDTO> {
        const products = await new ProductController(this.productService).getProductsByCategoryAndSortBy(orderByName,orderByPrice);
        const result: PaginationProductDTO = this.paginateRecords(products,_currentPage,_itemPerPage);
        return result;
    }

    @ApiOperation({
        summary: 'Get Products by filtering price + sorting with pagination',
        description: `
        get products by filtering price (within min - max range) or (>= min) or (<= max) then sorting with pagination
        
        ####### Required Parameters #########
        1.required QUERY_PARAM {currentPage} -> specify the current page
        2.required QUERY_PARAM {itemPerPage} -> specify the max item per page
        Available metadata returned: (currentPage, itemPerPage, totalItems, totalPages)
        returns a list of ProductDTO object for the current page selected
        
        ####### Optional Parameters #########
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
    @ApiQuery({
        name: "currentPage",
        description: "specify which page to retrieve",
    })
    @ApiQuery({
        name: "itemPerPage",
        description: "specify max number of items per page -> (min: 10, max: 50)",
    })
    @ApiResponse({
        status: 200,
        description: 'Displays a list of all the products from the database with price filter(s) + sorted by choice(s) selected',
        type: [PaginationProductDTO],
    })
    @ApiResponse({
        status: 400,
        description: ProductController.INVALID_PRICERANGE + " or " + ProductPaginateController.PAGE_NO_EXCEED,
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
        @Query("orderByPrice") orderByPrice ?: string,
        @Query('currentPage', new DefaultValuePipe(1), ParseIntPipe) _currentPage: number = 1,
        @Query('itemPerPage', new DefaultValuePipe(50), ParseIntPipe) _itemPerPage: number = 50,
    ): Promise<PaginationProductDTO> {
        const products = await new ProductController(this.productService).getProductByMinAndMaxPrice(minPrice,maxprice,orderByName,orderByPrice);
        const result: PaginationProductDTO = this.paginateRecords(products,_currentPage,_itemPerPage);
        return result;
    }

    @ApiOperation({
        summary: 'Get Products by filtering name + sorting with pagination',
        description: `
        get products by filtering name using the like clause + sorting with pagination
        
        ####### Required Parameters #########
        1.required QUERY_PARAM {currentPage} -> specify the current page
        2.required QUERY_PARAM {itemPerPage} -> specify the max item per page
        Available metadata returned: (currentPage, itemPerPage, totalItems, totalPages)
        returns a list of ProductDTO object for the current page selected
        
        ####### Optional Parameters #########
        3. {minprice} - OPTIONAL_PARAMETER, query will still work w/o min price input
        4. {maxprice) - OPTIONAL_PARAMETER, query will still work w/o max price input
        5. {orderByName} - OPTIONAL PARAMETER, query will sort by name
        6. {orderByPrice} - OPTIONAL PARAMETER, query will sort by price
        7. if orderby name + orderByPrice is used, it will sort by name first then price second
        8. if other values is provided to orderByName / orderByPrice, it will disregard the value and sort it in asc
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
    @ApiQuery({
        name: "currentPage",
        description: "specify which page to retrieve",
    })
    @ApiQuery({
        name: "itemPerPage",
        description: "specify max number of items per page -> (min: 10, max: 50)",
    })
    @ApiResponse({
        status: 200,
        description: 'Displays a list of all the products from the database with name filter(s) + sorted by choice(s) selected',
        type: [PaginationProductDTO],
    })
    @ApiResponse({
        status: 400,
        description: ProductPaginateController.PAGE_NO_EXCEED,
    })
    @ApiResponse({
        status: 404,
        description: ProductController.NO_PRODUCT_FOUND,
    })
    @Get("/filterByName/:name")
    async getProductByName(
        @Param('name') _name : string,
        @Query("orderByName") orderByName ?: string,
        @Query("orderByPrice") orderByPrice ?: string,
        @Query('currentPage', new DefaultValuePipe(1), ParseIntPipe) _currentPage: number = 1,
        @Query('itemPerPage', new DefaultValuePipe(50), ParseIntPipe) _itemPerPage: number = 50,
    ): Promise<PaginationProductDTO> {
        const products = await new ProductController(this.productService).getProductByName(_name,orderByName,orderByPrice);
        const result: PaginationProductDTO = this.paginateRecords(products,_currentPage,_itemPerPage);
        return result;
    }


}