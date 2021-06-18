import {ProductUtil} from "./productUtil";

describe("ProductUtil - validateUndefined()", () => {

    it("test validateUndefined - negative scenario", () => {
        const result = ProductUtil.validateUndefined(undefined);
        expect(result).toEqual("");
    });

    it("test validateUndefined - positive scenario", () => {
        const result = ProductUtil.validateUndefined(10);
        expect(result).toEqual(10);
    });

});

describe("ProductUtil - verifyMinMaxValueError()", () => {

    it("test verifyMinMaxValueError - 1st scenario", () => {
        const result = ProductUtil.verifyMinMaxValueError(undefined,undefined);
        expect(result).toBeNull();
    });

    it("test verifyMinMaxValueError - 2nd scenario", () => {
        const result = ProductUtil.verifyMinMaxValueError(10,undefined);
        expect(result).toEqual(ProductUtil.NO_ERROR);
    });

    it("test verifyMinMaxValueError - 3rd scenario", () => {
        const result = ProductUtil.verifyMinMaxValueError(undefined,30);
        expect(result).toEqual(ProductUtil.NO_ERROR);
    });

    it("test verifyMinMaxValueError - 4th scenario", () => {
        const result = ProductUtil.verifyMinMaxValueError(10,30);
        expect(result).toEqual(ProductUtil.NO_ERROR);
    });

    it("test verifyMinMaxValueError - 5th scenario", () => {
        const result = ProductUtil.verifyMinMaxValueError(30,10);
        expect(result).toEqual(ProductUtil.ERROR_OVERLAPPINGPRICES);
    });

});

describe("ProductUtil - defineMinMaxValueFunction()", () => {

    it("test defineMinMaxValueFunction - 1st scenario", () => {
        const result = ProductUtil.defineMinMaxValueFunction(10,undefined);
        expect(result['_type']).toEqual("moreThanOrEqual");
    });

    it("test defineMinMaxValueFunction - 2nd scenario", () => {
        const result = ProductUtil.defineMinMaxValueFunction(undefined,30);
        expect(result['_type']).toEqual("lessThanOrEqual");
    });

    it("test defineMinMaxValueFunction - 3rd scenario", () => {
        const result = ProductUtil.defineMinMaxValueFunction(10,30);
        expect(result['_type']).toEqual("between");
    });

});

// describe("ProductUtil - verifyOverlappingMinMaxValue()", () => {
//
//     it("test verifyOverlappingMinMaxValue - (positive scenario)", () => {
//         const result = ProductUtil.verifyOverlappingMinMaxValue(10,30);
//         expect(result).toBeFalsy();
//     });
//
//     it("test verifyOverlappingMinMaxValue - (negative scenario)", () => {
//         const result = ProductUtil.verifyOverlappingMinMaxValue(30,10);
//         expect(result).toBeTruthy();
//
//     });
//
// })