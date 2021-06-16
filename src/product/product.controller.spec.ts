import {ProductController} from "./product.controller";
import {ProductService} from "./product.service";
import {Test, TestingModule} from "@nestjs/testing";
import {INestApplication} from "@nestjs/common";
import * as request from 'supertest';
import {ProductDTO} from "./dto/productDTO";
import {CreateProductDTO} from "./dto/createProductDTO";
import {Product} from "./entity/product.entity";

class ProductControllerMock {
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
    let app : INestApplication;
    let controller : ProductController;
    let service : ProductService;
    let testAppModule : TestingModule;

    const mockProductService = {
        getManyProductBy : jest.fn(),
        createNewProduct : jest.fn()
    };

    beforeEach(async () => {
        const testAppModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide : ProductService,
                    useValue: mockProductService
                }
            ]
        }).compile();

        app = testAppModule.createNestApplication();
        controller = testAppModule.get<ProductController>(ProductController);
        service = testAppModule.get<ProductService>(ProductService);
        await app.init();
    });

    afterEach(async () => {
        app = null;
        service = null;
        controller = null;
    });

    afterAll(async () => {
        //close test module preventing memory leaks
        await testAppModule.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe("test - getAllProducts()" , () => {

        it('test - getAllProducts() (positive scenario)', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get('/product/')
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].id)
        });

        it('test - getAllProducts() (negative scenario)', async () => {

            mockProductService.getManyProductBy.mockResolvedValueOnce(null);
            const res = await request(app.getHttpServer())
                .get('/product/')
                .expect(400);
            expect(res.status).toEqual(400);
            expect(res.text.toString()).toContain(ProductController.NO_PRODUCT_FOUND);
        });

    });

    describe("test - createNewProduct()" , () => {

        it('test - createNewProduct() (positive scenario)', async () => {
            const product = new ProductControllerMock().getOneProduct();
            const dto = new CreateProductDTO('red shirt','t-shirt',0);

            mockProductService.createNewProduct.mockResolvedValueOnce(product);
            const res = await request(app.getHttpServer())
                .post('/product/')
                .send(dto)
                .expect(201);
            expect(res.status).toEqual(201);
            expect(res.text.toString()).toContain(product.name)
        });

        it('test - createNewProduct() (negative scenario)', async () => {
            const dto = new CreateProductDTO('red shirt','t-shirt',-10);

            mockProductService.createNewProduct.mockResolvedValueOnce(null);
            const res = await request(app.getHttpServer())
                .post('/product/')
                .send(dto)
                .expect(400);
            expect(res.status).toEqual(400);
            expect(res.text.toString()).toContain(ProductController.INVALID_INPUT)
        });

    });

    describe("test - getProductsByCategoryAndSortBy()" , () => {

        it('test - no query provided (positive scenario)', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get('/product/sortby')
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name)
        });

        it('test - 1 query used(orderby_name) (positive scenario)', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get('/product/sortby?orderby_name=desc')
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name)
        });

        it('test - 1 query used(orderby_price) (positive scenario)', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get('/product/sortby?orderby_price=desc')
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name)
        });

        it('test - 2 query(s) used(orderby_name,orderby_price) (positive scenario)', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get('/product/sortby?orderby_price=desc&orderby_name=asc')
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name)
        });

    });

});