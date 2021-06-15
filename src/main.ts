import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module'
import {SwaggerModule, DocumentBuilder} from "@nestjs/swagger";
import initDB from "./database_init";

const config = require( 'config');
const cors = require("cors");


async function bootstrap() {
  initDB();

  /* app config */
  const app = await NestFactory.create(AppModule);
  app.use(function (req, res, next ) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(cors({ origin: true }));

  /* swagger config */
  const options = new DocumentBuilder()
      .setTitle(config.swaggerOptions.title)
      .setDescription(config.swaggerOptions.description)
      .setVersion(config.swaggerOptions.version)
      .addTag(config.swaggerOptions.product_api)
      .addTag(config.swaggerOptions.pagination_api)
      .build();
  const document = SwaggerModule.createDocument(app,options);
  SwaggerModule.setup(config.swaggerOptions.swagger_api_url,app,document);

  /* start app */
  const port_number = config.app.port;
  await app.listen(port_number);
}

bootstrap();
