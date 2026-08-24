import request = require('supertest');
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Recognized Transactions (e2e)', () => {
  it('/banking/recognized (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/recognized')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
