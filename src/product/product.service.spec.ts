import {Test, TestingModule} from '@nestjs/testing';
import {ProductService} from './product.service';
import {Product} from "./entity/product.entity";
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from "typeorm";
import {CreateProductDTO} from "./dto/createProductDTO";

class ProductServiceMock {
  getProductList() {
    const list = [
      this.getOneProduct(),
    ];
    return list;
  }
  getOneProduct() {
    return new Product(1,'red shirt','t-shirt',20.50);
  }
}

describe('ProductService', () => {
  const token = getRepositoryToken(Product);
  let repository : Repository<Product>;
  let service: ProductService;
  let testAppModule : TestingModule;

  const mockUsersRepository = {
    find : jest.fn(),
    findOne : jest.fn(),
    save : jest.fn(),
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

  describe("test - getManyProductsBy" , () => {
      it("test - getManyProductsBy (positive scenario)", async () => {
        const productList = new ProductServiceMock().getProductList();
        mockUsersRepository.find.mockResolvedValueOnce(productList);

        const result = await service.getManyProductBy({});
        expect(result).toEqual(productList);
      });

      it("test - getManyProductsBy (negative scenario - 1)", async () => {
        mockUsersRepository.find.mockResolvedValueOnce(null);

        const result = await service.getManyProductBy({});
        expect(result).toEqual(null);
      });

    it("test - getManyProductsBy (negative scenario - 2)", async () => {
      mockUsersRepository.find.mockResolvedValueOnce(undefined);

      const result = await service.getManyProductBy({});
      expect(result).toEqual(null);
    });

    it("test - getManyProductsBy (negative scenario - 3)", async () => {
      mockUsersRepository.find.mockResolvedValueOnce([]);

      const result = await service.getManyProductBy({});
      expect(result).toEqual(null);
    });
  });

  describe("test - getOneProduct" , () => {
    it("test - getOneProduct (positive scenario)", async () => {
      const oneProduct = new ProductServiceMock().getOneProduct();
      mockUsersRepository.findOne.mockResolvedValueOnce(oneProduct);

      const result = await service.getOneProduct({});
      expect(result).toEqual(oneProduct);
    });

    it("test - getOneProduct (negative scenario - 1)", async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);

      const result = await service.getOneProduct({});
      expect(result).toEqual(null);
    });

    it("test - getOneProduct (negative scenario - 2)", async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(undefined);

      const result = await service.getOneProduct({});
      expect(result).toEqual(null);
    });

  });

  describe("test - createNewProduct" , () => {
    it("test - createNewProduct (scenario)", async () => {
      const oneProduct = new ProductServiceMock().getOneProduct();
      const mockData = new CreateProductDTO(oneProduct.name,oneProduct.description, parseFloat(oneProduct.price.toString()));
      mockUsersRepository.save.mockResolvedValueOnce(oneProduct);

      const result = await service.createNewProduct(mockData);
      expect(result).toEqual(oneProduct);
    });

  });

});
