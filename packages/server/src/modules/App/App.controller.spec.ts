import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './App.controller';
import { AppService } from './App.service';

describe('AppController', () => {
  let _appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    _appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {});
  });
});
