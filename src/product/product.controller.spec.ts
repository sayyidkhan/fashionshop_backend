import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import {HttpModule, HttpService, INestApplication} from "@nestjs/common";
import {ProductService} from "./product.service";
import {ProductModule} from "./product.module";
import * as request from 'supertest';
import {Product} from "./entity/product.entity";
import {ProductDTO} from "./dto/productDTO";
import {AppModule} from "../app.module";

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

  const mockGetManyProductBy = jest.fn();

  beforeEach(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
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

  it('get All products', async () => {
    const list = new ProductControllerMock().getProductDTOList();

    mockGetManyProductBy.mockResolvedValueOnce(list);
    const res = await request(app.getHttpServer())
        .get('/product/')
        .expect(200);
    expect(res.status).toEqual(200);
    console.log(res.text);
  });


});
