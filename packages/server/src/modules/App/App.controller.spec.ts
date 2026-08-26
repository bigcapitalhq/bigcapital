import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './App.controller';
import { AppService } from './App.service';

describe('AppController', () => {
  beforeEach(async () => {
    const _app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {});
  });
});
