import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const cors = require("cors");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(function (req, res, next ) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(cors({ origin: true }));

  await app.listen(5000);
}
bootstrap();
