import * as request from 'supertest';
import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/modules/App/App.module';

let app: INestApplication;

const email = 'bigcapital@bigcapital.com';
const password = '123123123';

let orgainzationId = '';
let authenticationToken = '';
let AuthorizationHeader = '';

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  const signinResponse = await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email, password });

  authenticationToken = signinResponse.body.access_token;
  AuthorizationHeader = `Bearer ${authenticationToken}`;
  orgainzationId = signinResponse.body.organization_id;
});

afterAll(async () => {
  await app.close();
});
jest.retryTimes(3, { logErrorsBeforeRetry: true });

export { app, orgainzationId, authenticationToken, AuthorizationHeader };
