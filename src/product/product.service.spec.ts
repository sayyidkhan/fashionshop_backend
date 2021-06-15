import {Test, TestingModule} from '@nestjs/testing';
import {ProductService} from './product.service';
import {Product} from "./entity/product.entity";
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from "typeorm";

class ProductServiceMock {
  getProductList() {
    const list = [
      new Product(1,'red shirt','t-shirt',20.50)
    ];
    return list;
  }
}



describe('ProductService', () => {
  const token = getRepositoryToken(Product);
  let repository : Repository<Product>;
  let service: ProductService;
  let testAppModule : TestingModule;

  const mockUsersRepository = {
    find : jest.fn(),
  }

  beforeEach(async () => {
    testAppModule = await Test.createTestingModule({
      providers: [
          ProductService,
          {
            provide: token,
            useValue : mockUsersRepository,
          },
      ],
    }).compile();

    service = testAppModule.get<ProductService>(ProductService);
    repository = testAppModule.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(async () => {
    service = null;
    repository = null;
  });

  afterAll(async () => {
    //close test module preventing memory leaks
    await testAppModule.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("test - getManyProductsBy", async () => {
    const productList = new ProductServiceMock().getProductList();
    mockUsersRepository.find.mockResolvedValueOnce(productList);

    const result = await service.getManyProductBy({});
    expect(result !== null).toBeTruthy();
  });

});
