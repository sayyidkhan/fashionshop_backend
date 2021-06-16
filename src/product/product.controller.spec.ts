import {Test, TestingModule} from '@nestjs/testing';
import {ProductController} from './product.controller';
import {HttpModule, HttpService, INestApplication} from "@nestjs/common";
import {ProductService} from "./product.service";
import {ProductModule} from "./product.module";
import * as request from 'supertest';
import {ProductDTO} from "./dto/productDTO";
import {AppModule} from "../app.module";
import exp = require("constants");

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
  let productService: ProductService;
  let httpService : HttpService;
  let testAppModule : TestingModule;

  const mockGetManyProductBy = jest.fn();

  beforeEach(async () => {
    testAppModule = await Test.createTestingModule({
      imports: [
          ProductModule,
          AppModule,
          HttpModule,
      ],
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
    productService = testAppModule.get<ProductService>(ProductService);
    httpService = testAppModule.get<HttpService>(HttpService);
    await app.init();
  });

  afterEach(async () => {
    app = null;
    httpService = null;
  });

  afterAll(async () => {
    //close test module preventing memory leaks
    await testAppModule.close();
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
      const list = new ProductControllerMock().getProductDTOList();

      mockGetManyProductBy.mockResolvedValueOnce(list);
      const res = await request(app.getHttpServer())
          .get('/product/')
          .expect(400);
      expect(res.status).toEqual(400);
      expect(res.text.toString()).toContain(list[0].id)
    });
  });




});
