import {ProductController} from "./product.controller";
import {ProductService} from "./product.service";
import {Test, TestingModule} from "@nestjs/testing";
import {ProductModule} from "./product.module";
import {HttpException, HttpModule, HttpService, INestApplication} from "@nestjs/common";
import * as request from 'supertest';
import {ProductDTO} from "./dto/productDTO";

class ProductControllerMock {
    getProductDTOList() {
        const list = [
            new ProductDTO(1,'red shirt','t-shirt',20.50)
        ];
        return list;
    }
}

describe('ProductController', () => {
    let app : INestApplication;
    let controller : ProductController;
    let service : ProductService;
    let testAppModule : TestingModule;

    const mockGetManyProductBy = jest.fn();

    beforeEach(async () => {
        const testAppModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide : ProductService,
                    useValue: {
                        getManyProductBy : mockGetManyProductBy,
                    }
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

            mockGetManyProductBy.mockResolvedValueOnce(list);
            const res = await request(app.getHttpServer())
                .get('/product/')
                .expect(200);
            expect(res.status).toEqual(200);
            expect(res.text.toString()).toContain(list[0].id)
        });

        it('test - getAllProducts() (negative scenario)', async () => {

            mockGetManyProductBy.mockResolvedValueOnce(null);
            const res = await request(app.getHttpServer())
                .get('/product/')
                .expect(400);
            expect(res.status).toEqual(400);
        });

    });

});