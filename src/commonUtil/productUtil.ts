import {Between, LessThanOrEqual, MoreThanOrEqual} from "typeorm";

export abstract class ProductUtil {

    static ERROR_OVERLAPPINGPRICES = "min price greater than max price";
    static NO_ERROR = "no error";

    public static validateUndefined(obj : any) {
        const result = obj === undefined ? "" : obj;
        return result;
    }

    public static verifyMinMaxValueError(minprice ?: number, maxprice ?: number) {
        //function checks for error in min and max
        let min = this.validateUndefined(minprice);
        let max = this.validateUndefined(maxprice);

        //both are empty - no query will be performed
        if(min === "" && max === "") {
            return null;
        }
        //min is not empty and max is empty
        if(min !== "" && max === "") {
            return this.NO_ERROR;
        }
        //min is empty and max is not empty
        else if(min === "" && max !== "") {
            return this.NO_ERROR;
        }
        else {
            const result = this.verifyOverlappingMinMaxValue(minprice, maxprice);
            return (result) ? this.ERROR_OVERLAPPINGPRICES : this.NO_ERROR;
        }
    }

    public static defineMinMaxValueFunction(minprice ?: number, maxprice ?: number) {
        //function implements the function in the where clause
        let min = this.validateUndefined(minprice);
        let max = this.validateUndefined(maxprice);

        //min is not empty and max is empty
        if(min !== "" && max === "") {
            return MoreThanOrEqual(minprice);
        }
        //min is empty and max is not empty
        else if(min === "" && max !== "") {
            return LessThanOrEqual(maxprice);
        }
        //both is not empty
        else {
            return Between(minprice, maxprice);
        }

    }

    private static verifyOverlappingMinMaxValue(minprice : number, maxprice : number) {
        return (minprice >= maxprice);
    }

}