import {INestApplication} from "@nestjs/common";
import {ProductController} from "./product.controller";
import {ProductService} from "./product.service";
import {Test, TestingModule} from "@nestjs/testing";
import {ProductPaginateController} from "./product.paginate.controller";
import * as request from 'supertest';
import {Product} from "./entity/product.entity";
import {PaginationUtil} from "../commonUtil/paginationUtil";
import mock = jest.mock;

class ProductPaginateControllerMock {
    getProductDTOList() {
        const list = [
            this.getOneProduct(),
        ];
        return list;
    }
    getOneProduct() {
        return new Product(1,'red shirt','t-shirt',20.50);
    }
}

describe('ProductController', () => {
    let app: INestApplication;
    let paginationController : ProductPaginateController;
    let controller: ProductController;
    let service: ProductService;
    let testAppModule: TestingModule;

    const mockProductService = {
        getManyProductBy: jest.fn(),
        getOneProduct: jest.fn(),
        createNewProduct: jest.fn()
    };

    beforeEach(async () => {
        const testAppModule = await Test.createTestingModule({
            controllers: [ProductController , ProductPaginateController ],
            providers: [
                {
                    provide: ProductService,
                    useValue: mockProductService
                }
            ]
        }).compile();

        app = testAppModule.createNestApplication();
        paginationController = testAppModule.get<ProductPaginateController>(ProductPaginateController);
        controller = testAppModule.get<ProductController>(ProductController);
        service = testAppModule.get<ProductService>(ProductService);
        await app.init();
    });

    afterEach(async () => {
        app = null;
        service = null;
        paginationController = null;
        controller = null;
    });

    afterAll(async () => {
        //close test module preventing memory leaks
        await testAppModule.close();
    });

    it('should be defined', () => {
        expect(paginationController).toBeDefined();
        expect(controller).toBeDefined();
    });

    const currentPage = "currentPage=1";
    const itemPerPage = "itemPerPage=10";

    describe("test - getAllProducts()" , () => {

        it('test - getAllProducts() (positive scenario)', async () => {
            const list = new ProductPaginateControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get(`/product/pg?${currentPage}&${itemPerPage}`)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].id)
        });

        it('test - getAllProducts() (1st - negative scenario)', async () => {

            mockProductService.getManyProductBy.mockResolvedValueOnce([]);
            const res = await request(app.getHttpServer())
                .get(`/product/pg?${currentPage}&${itemPerPage}`)
                .expect(400);
            expect(res.status).toEqual(400);
            expect(res.text.toString()).toContain(ProductPaginateController.PAGE_NO_EXCEED);
        });

        it('test - getAllProducts() (2nd - negative scenario)', async () => {

            mockProductService.getManyProductBy.mockResolvedValueOnce(null);
            const res = await request(app.getHttpServer())
                .get(`/product/pg?${currentPage}&${itemPerPage}`)
                .expect(404);
            expect(res.status).toEqual(404);
            expect(res.text.toString()).toContain(ProductController.NO_PRODUCT_FOUND);
        });

    });

    describe("test - getProductsByCategoryAndSortBy()" , () => {
        const uri_endpoint = "sortby";

        it('test - getProductsByCategoryAndSortBy() (positive scenario)', async () => {
            const list = new ProductPaginateControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get(`/product/pg/${uri_endpoint}?${currentPage}&${itemPerPage}`)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].id)
        });

        it('test - getProductsByCategoryAndSortBy() (1st - negative scenario)', async () => {

            mockProductService.getManyProductBy.mockResolvedValueOnce([]);
            const res = await request(app.getHttpServer())
                .get(`/product/pg/${uri_endpoint}?${currentPage}&${itemPerPage}`)
                .expect(400);
            expect(res.status).toEqual(400);
            expect(res.text.toString()).toContain(ProductPaginateController.PAGE_NO_EXCEED);
        });

        it('test - getProductsByCategoryAndSortBy() (2nd - negative scenario)', async () => {

            mockProductService.getManyProductBy.mockResolvedValueOnce(null);
            const res = await request(app.getHttpServer())
                .get(`/product/pg/${uri_endpoint}?${currentPage}&${itemPerPage}`)
                .expect(404);
            expect(res.status).toEqual(404);
            expect(res.text.toString()).toContain(ProductController.NO_PRODUCT_FOUND);
        });

    });

    describe("test - getProductByMinAndMaxPrice()" , () => {
        const uri_endpoint = "filterByPrice";

        it('test - getProductByMinAndMaxPrice() (positive scenario)', async () => {
            const list = new ProductPaginateControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get(`/product/pg/${uri_endpoint}?${currentPage}&${itemPerPage}`)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].id)
        });

        it('test - getProductByMinAndMaxPrice() (1st - negative scenario)', async () => {

            mockProductService.getManyProductBy.mockResolvedValueOnce([]);
            const res = await request(app.getHttpServer())
                .get(`/product/pg/${uri_endpoint}?${currentPage}&${itemPerPage}`)
                .expect(400);
            expect(res.status).toEqual(400);
            expect(res.text.toString()).toContain(ProductPaginateController.PAGE_NO_EXCEED);
        });

        it('test - getProductByMinAndMaxPrice() (2nd - negative scenario)', async () => {

            mockProductService.getManyProductBy.mockResolvedValueOnce(null);
            const res = await request(app.getHttpServer())
                .get(`/product/pg/${uri_endpoint}?${currentPage}&${itemPerPage}`)
                .expect(404);
            expect(res.status).toEqual(404);
            expect(res.text.toString()).toContain(ProductController.NO_PRODUCT_FOUND);
        });

    });

    describe("test - getProductByName()" , () => {
        const uri_endpoint = "filterByName/jacket";

        it('test - getProductByName() (positive scenario)', async () => {
            const list = new ProductPaginateControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get(`/product/pg/${uri_endpoint}?${currentPage}&${itemPerPage}`)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].id)
        });

        it('test - getProductByName() (1st - negative scenario)', async () => {

            mockProductService.getManyProductBy.mockResolvedValueOnce([]);
            const res = await request(app.getHttpServer())
                .get(`/product/pg/${uri_endpoint}?${currentPage}&${itemPerPage}`)
                .expect(400);
            expect(res.status).toEqual(400);
            expect(res.text.toString()).toContain(ProductPaginateController.PAGE_NO_EXCEED);
        });

        it('test - getProductByName() (2nd - negative scenario)', async () => {

            mockProductService.getManyProductBy.mockResolvedValueOnce(null);
            const res = await request(app.getHttpServer())
                .get(`/product/pg/${uri_endpoint}?${currentPage}&${itemPerPage}`)
                .expect(404);
            expect(res.status).toEqual(404);
            expect(res.text.toString()).toContain(ProductController.NO_PRODUCT_FOUND);
        });

    });



});