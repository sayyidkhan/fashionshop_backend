import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Product} from "./entity/product.entity";
import {ProductPaginateController} from "./product.paginate.controller";

@Module({
  imports: [
      TypeOrmModule.forFeature([Product]),
  ],
  providers: [ProductService],
  controllers: [ProductController, ProductPaginateController]
})
export class ProductModule {}
