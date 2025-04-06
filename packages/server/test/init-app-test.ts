import * as request from 'supertest';
import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/modules/App/App.module';

let app: INestApplication;

const email = 'ahmed@sa1234dsad.com';
const password = '123123123';

let orgainzationId = 'hpgpqfqom8zic574';
let authenticationToken = '';
let AuthorizationHeader = '';

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

// jest.retryTimes(3, { logErrorsBeforeRetry: true });

beforeAll(async () => {
  const signinResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);

  authenticationToken = signinResponse.body.access_token; 
  AuthorizationHeader = `Bearer ${authenticationToken}`;
})

export { app, orgainzationId, authenticationToken, AuthorizationHeader };
