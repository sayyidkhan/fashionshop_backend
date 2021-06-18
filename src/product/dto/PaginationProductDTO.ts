import {ApiProperty} from "@nestjs/swagger";
import {ProductDTO} from "./productDTO";

abstract class PaginationMetadata {

    protected constructor(currentPage: number, itemPerPage: number, totalItems: number,totalPages: number) {
        this.currentPage = currentPage;
        this.itemPerPage = itemPerPage;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
    }

    @ApiProperty({
        description : "returns the current page",
        default: 1,
        type : Number,
    })
    currentPage : number;

    @ApiProperty({
        description : "returns the itemPerPage limit",
        minimum : 10,
        maximum : 50,
        default: 50,
        type : Number,
    })
    itemPerPage : number;

    @ApiProperty({
        description : "returns the total number of items in the records retrieved",
        default: 1,
        type : Number,
    })
    totalItems : number;

    @ApiProperty({
        description : "returns the total number of pages created",
        default: 1,
        type : Number,
    })
    totalPages : number;

}

export class PaginationProductDTO extends PaginationMetadata {

    constructor(data : ProductDTO[],currentPage,itemPerPage,totalItems,totalPages) {
        super(currentPage,itemPerPage,totalItems,totalPages);
        this.data = data;
    }

    @ApiProperty({
        description : "retrieve a list of ProductDTO for the current page",
        type : [ ProductDTO ]
    })
    data : ProductDTO[];

}