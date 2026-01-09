import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Bill Landed Costs (e2e)', () => {
  it('/landed-cost/transactions (GET)', () => {
    return request(app.getHttpServer())
      .get('/landed-cost/transactions')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/landed-cost/bills/:billId/transactions (GET)', () => {
    return request(app.getHttpServer())
      .get('/landed-cost/bills/1/transactions')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
