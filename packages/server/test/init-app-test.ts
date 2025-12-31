import * as request from 'supertest';
import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/modules/App/App.module';

let app: INestApplication;

const email = 'felixetienne.gauthier@proton.me';
const password = 'FelixE280396';

let orgainzationId = 'ei77hd1mjsx0kxg';
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
    .send({ email, password })
    .expect(201);

  authenticationToken = signinResponse.body.access_token;
  AuthorizationHeader = `Bearer ${authenticationToken}`;
});

afterAll(async () => {
  await app.close();
});
// jest.retryTimes(3, { logErrorsBeforeRetry: true });

export { app, orgainzationId, authenticationToken, AuthorizationHeader };
