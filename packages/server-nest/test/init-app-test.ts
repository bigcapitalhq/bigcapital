import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/modules/App/App.module';

let app: INestApplication;

let orgainzationId = 'hpgpqhanm8s4921m';
let authenticationToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNzQ4MzExOTc5LjIzOCwiaWF0IjoxNzQzMTI3OTc5fQ.h3xvmuNjeyFeshEZRVRLCsARgTpx4xeZQHQuZzESm2U';

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
