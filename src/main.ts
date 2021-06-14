import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module'
import initDB from "./database_init";

const config = require( 'config');
const cors = require("cors");


async function bootstrap() {
  initDB();

  const app = await NestFactory.create(AppModule);
  app.use(function (req, res, next ) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(cors({ origin: true }));

  const port_number = config.app.port;
  await app.listen(port_number);
}

bootstrap();
