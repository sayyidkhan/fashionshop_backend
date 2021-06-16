import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AppModule} from "./app.module";

describe('AppController', () => {
  let appController: AppController;
  let testAppModule : TestingModule;

  beforeEach(async () => {
    testAppModule = await Test.createTestingModule({
      imports: [
          AppModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = testAppModule.get<AppController>(AppController);
  });


  afterAll(async () => {
    //close test module preventing memory leaks
    await testAppModule.close();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
