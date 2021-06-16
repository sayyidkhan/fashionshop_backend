import {ProductController} from "./product.controller";
import {ProductService} from "./product.service";
import {Test, TestingModule} from "@nestjs/testing";
import {INestApplication} from "@nestjs/common";
import * as request from 'supertest';
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
        getOneProduct : jest.fn(),
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

    describe("test - getProductById()" , () => {

        it('test - getProductById() (positive scenario)', async () => {
            const product = new ProductControllerMock().getOneProduct();

            mockProductService.getOneProduct.mockResolvedValueOnce(product);
            const res = await request(app.getHttpServer())
                .get('/product/filterby_id/' + product.id)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(product.name);
        });

        it('test - getProductById() (negative scenario)', async () => {
            const product = new ProductControllerMock().getOneProduct();

            mockProductService.getOneProduct.mockResolvedValueOnce(null);
            const res = await request(app.getHttpServer())
                .get('/product/filterby_id/' + product.id)
                .expect(404);
            expect(res.status).toEqual(404);
            expect(res.text.toString()).toContain(ProductController.NO_PRODUCT_FOUND);
        });

    });

    describe("test - getProductById()" , () => {
        const minprice_query = "minprice=10";
        const invalid_maxprice_query = "maxprice=9";
        const maxprice_query = "maxprice=80";
        const orderby_name_query = "orderby_name=asc";
        const orderby_price_query = "orderby_price=asc";

        it('test - 0 query used (positive scenario)', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get('/product/filterby_price')
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name);
        });

        it('test - 1 query used (minprice) (positive scenario) - test min price set but no max price set', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get(`/product/filterby_price?${minprice_query}`)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name);
        });

        it('test - 1 query used (maxprice) (positive scenario) - test max price set but no min price set', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get(`/product/filterby_price?${maxprice_query}`)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name);
        });

        it('test - 2 query used (minprice,maxprice) (positive scenario) - test find price within range', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get(`/product/filterby_price?${minprice_query}&${maxprice_query}`)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name);
        });

        it('test - 4 query used (minprice,maxprice,orderby_name,orderby_price) (positive scenario)', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get(`/product/filterby_price?${minprice_query}&${maxprice_query}&${orderby_name_query}&${orderby_price_query}`)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name);
        });

        it('test - (negative scenario)', async () => {
            mockProductService.getManyProductBy.mockResolvedValueOnce(null);
            const res = await request(app.getHttpServer())
                .get(`/product/filterby_price`)
                .expect(404);
            expect(res.status).toEqual(404);
            expect(res.text.toString()).toContain(ProductController.NO_PRODUCT_FOUND);
        });

        it('test - 2 query used(minprice,maxprice) (negative scenario) - to validate if invalid range throw error', async () => {
            const res = await request(app.getHttpServer())
                .get(`/product/filterby_price?${minprice_query}&${invalid_maxprice_query}`)
                .expect(400);
            expect(res.status).toEqual(400);
            expect(res.text.toString()).toContain(ProductController.INVALID_PRICERANGE);
        });

    });

    describe("test - getProductByName()" , () => {
        const param_name = "name";
        const orderby_name_query = "orderby_name=asc";
        const orderby_price_query = "orderby_price=asc";

        it('test - param not used (positive scenario)', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get(`/product/filterby_name/${param_name}`)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name);
        });

        it('test - 1 query used (orderby_name) (positive scenario)', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get(`/product/filterby_name/${param_name}?${orderby_name_query}`)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name);
        });

        it('test - 2 query used (orderby_name,orderby_price) (positive scenario)', async () => {
            const list = new ProductControllerMock().getProductDTOList();

            mockProductService.getManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get(`/product/filterby_name/${param_name}?${orderby_name_query}&${orderby_price_query}`)
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].name);
        });

        it('test - param not used (negative scenario)', async () => {
            mockProductService.getManyProductBy.mockResolvedValueOnce(null);
            const res = await request(app.getHttpServer())
                .get(`/product/filterby_name/${param_name}`)
                .expect(404);
            expect(res.status).toEqual(404);
            expect(res.text.toString()).toContain(ProductController.NO_PRODUCT_FOUND);
        });


    });

});