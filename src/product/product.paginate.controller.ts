import {ProductService} from "./product.service";
import {Controller, DefaultValuePipe, Get, HttpException, HttpStatus, ParseIntPipe, Query} from "@nestjs/common";
import {ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {ProductController} from "./product.controller";
import {PaginationUtil} from "../commonUtil/paginationUtil";
import {PaginationProductDTO} from "./dto/PaginationProductDTO";

const config = require( 'config');

@ApiBearerAuth()
@ApiTags(config.swaggerOptions.pagination_api)
@Controller('product/pg/')
export class ProductPaginateController {
    constructor(private readonly productService : ProductService) {}

    @ApiOperation({
        summary: 'Get All Products using Pagination',
        description: `
        1.required QUERY_PARAM {currentPage} -> specify the current page
        2.required QUERY_PARAM {itemPerPage} -> specify the max item per page
        Available metadata returned: (currentPage, itemPerPage, totalItems, totalPages)
        returns a list of ProductDTO object for the current page selected
        `,
    })
    @ApiQuery({
        name: "currentPage",
        description: "specify with page record to retrieve",
    })
    @ApiQuery({
        name: "itemPerPage",
        description: "specify max number of items per page -> (min: 10, max: 100)",
    })
    @ApiResponse({
        status: 200,
        description: 'Displays a list of all the products in PaginationProductDTO sorted by title from [A - Z] & price from lowest to highest',
        type: [PaginationProductDTO],
    })
    @ApiResponse({
        status: 400,
        description: PaginationUtil.PAGE_NO_EXCEED,
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
        _itemPerPage = PaginationUtil.pageLimit(_itemPerPage);
        const products = await new ProductController(this.productService).getAllProducts();
        if(products !== null) {
            try {
                const result = PaginationUtil.getPaginatedList(products,_currentPage,_itemPerPage);
                return result;
            }
            catch (e) {

                throw new HttpException(
                    PaginationUtil.PAGE_NO_EXCEED,
                    HttpStatus.BAD_REQUEST
                );
            }
        }
    }

}