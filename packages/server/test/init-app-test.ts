import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService } from '@nestjs/core';
import { WorkerHost } from '@nestjs/bullmq';
import { AppModule } from '../src/modules/App/App.module';

let app: INestApplication;

const email = 'kk@kk.com';
const password = '1231231230';

let orgainzationId = '';
let authenticationToken = '';
let AuthorizationHeader = '';
let authenticatedUserId: number | undefined;

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
  authenticatedUserId = signinResponse.body.user_id;
});

afterAll(async () => {
  // Nest runs no lifecycle hooks on request-scoped providers, so app.close()
  // leaves the workers of request-scoped processors, such as the organization
  // build, running. A job queued by a later test file could then be taken by
  // a worker whose file is gone, and fail. Close every worker first.
  await Promise.all(
    app
      .get(DiscoveryService)
      .getProviders()
      .map((wrapper) => wrapper.instance)
      .filter(
        (instance): instance is WorkerHost => instance instanceof WorkerHost,
      )
      .map((host) => host.onApplicationShutdown()),
  );
  await app.close();
});
jest.retryTimes(3, { logErrorsBeforeRetry: true });

export {
  app,
  orgainzationId,
  authenticationToken,
  AuthorizationHeader,
  authenticatedUserId,
};
