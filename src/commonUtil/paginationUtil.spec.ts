import {PaginationUtil} from "./paginationUtil";


describe("PaginationUtil - getPaginatedList()", () => {

    it("getPaginatedList() positive scenario" , () => {
        let foo = []; // 300 data

        for (let i = 1; i <= 300; i++) {
            foo.push(i);
        }

        const result = PaginationUtil.getPaginatedList(foo,1,50);
        expect(result.total).toEqual(300);
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
        }).toThrowError(PaginationUtil.PAGE_NO_EXCEED);
    });

    it("getPaginatedList() 3rd - negative scenario" , () => {
        const result = PaginationUtil.getPaginatedList(null,1,0);
        expect(result).toBeNull();
    });

});