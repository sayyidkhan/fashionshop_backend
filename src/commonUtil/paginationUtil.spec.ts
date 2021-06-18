import {PaginationUtil} from "./paginationUtil";
import {ProductPaginateController} from "../product/product.paginate.controller";


describe("PaginationUtil - getPaginatedList()", () => {

    it("getPaginatedList() 1st positive scenario" , () => {
        let foo = []; // 300 data

        for (let i = 1; i <= 300; i++) {
            foo.push(i);
        }

        const result = PaginationUtil.getPaginatedList(foo,1,50);
        expect(result.totalItems).toEqual(300);
        expect(result.data[0]).toEqual(1);
    });

    it("getPaginatedList() 2nd positive scenario" , () => {
        let foo = []; // 300 data

        for (let i = 1; i <= 300; i++) {
            foo.push(i);
        }

        const result = PaginationUtil.getPaginatedList(foo,-1,50);
        expect(result.totalItems).toEqual(300);
        expect(result.data[0]).toEqual(1);
    });

    it("getPaginatedList() 1st - negative scenario" , () => {
        let foo = []; // 300 data

        for (let i = 1; i <= 300; i++) {
            foo.push(i);
        }

        const result = PaginationUtil.getPaginatedList(foo,1,0);
        expect(result).toBeNull();
    });

    it("getPaginatedList() 2nd - negative scenario" , () => {
        let foo = []; // 300 data

        for (let i = 1; i <= 300; i++) {
            foo.push(i);
        }

        expect(() => {
            PaginationUtil.getPaginatedList(foo,50,100);
        }).toThrowError(ProductPaginateController.PAGE_NO_EXCEED);
    });

    it("getPaginatedList() 3rd - negative scenario" , () => {
        const result = PaginationUtil.getPaginatedList(null,1,0);
        expect(result).toBeNull();
    });

});


describe("test - pageLimit()", () => {

    it("pageLimit() - positive scenario" , () => {
        const value = 50;
        const result = PaginationUtil.pageLimit(value);
        expect(result).toEqual(50);
    });

    it("pageLimit() - negative scenario" , () => {
        const value = 100;
        const result = PaginationUtil.pageLimit(value);
        expect(result).toEqual(50);
    });

});