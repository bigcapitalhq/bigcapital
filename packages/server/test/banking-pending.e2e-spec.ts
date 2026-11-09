import request = require('supertest');
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Pending Transactions (e2e)', () => {
  it('/banking/pending (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/pending')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
