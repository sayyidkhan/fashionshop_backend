import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import {Product} from "./product/entity/product.entity";
const config = require("config");

const database = config.db;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: database.host,
      port: database.port,
      username: database.username,
      password: database.password,
      database: database.database,
      entities: [Product],
      synchronize: true,
      logging : false,
    }),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
