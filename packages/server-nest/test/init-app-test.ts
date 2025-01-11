import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/modules/App/App.module';

let app: INestApplication;

let orgainzationId = 'fxdo7u419m5ryy4tb';
let authenticationToken = '';

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await app.close();
});

jest.retryTimes(3, { logErrorsBeforeRetry: true });

export { app, orgainzationId, authenticationToken };
