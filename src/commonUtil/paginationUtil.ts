import {PaginationProductDTO} from "../product/dto/PaginationProductDTO";

export abstract class PaginationUtil {

    static PAGE_NO_EXCEED =  "ERROR: Page number query exceeds available page range.";

    private static convertListIntoNestedList(mylist : any[],pagelimit : number) {
        if(pagelimit <= 0) {
            return null;
        }
        else {
            //accomplishing the task using O(n) time complexity
            const result = mylist.reduce((a, c, i) => {
                return i % pagelimit === 0 ? a.concat([mylist.slice(i, i + pagelimit)]) : a;
            }, []);

            return result;
        }
    }

    private static getByPageNumber(nestedlist: any[], page : number) {
        if(nestedlist === null) {
            return null;
        }
        if(page > nestedlist.length) {
            console.log("page no exceed");
            throw new Error(this.PAGE_NO_EXCEED);
        }
        else {
            return nestedlist[page - 1];
        }
    }

    public static getPaginatedList(mylist : any[], _currentPage : number, itemPerPage : number) {
        const nestedList = this.convertListIntoNestedList(mylist,itemPerPage);
        const data = this.getByPageNumber(nestedList,_currentPage);
        if(nestedList !== null) {
            _currentPage = _currentPage <= 0 ? 1 : parseInt(_currentPage.toString());
            const totalItems = mylist.length;
            const totalPages = nestedList.length;
            const result = new PaginationProductDTO(data,_currentPage,itemPerPage,totalItems,totalPages);
            return result;
        }
        return null;
    }

    public static pageLimit(currentLimit : number) {
        const maxPageLimit = 50;
        //set the max page limit
        currentLimit = currentLimit > maxPageLimit ? maxPageLimit : currentLimit;
        return currentLimit;
    }

}