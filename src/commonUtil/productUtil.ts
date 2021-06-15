export abstract class ProductUtil {

    public static validateUndefined(obj : any) {
        const result = obj === undefined ? "" : obj;
        return result;
    }

}