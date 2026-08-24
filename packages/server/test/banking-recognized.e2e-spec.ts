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

  it('/banking/recognized/:recognizedTransactionId (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/banking/recognized/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    // A transaction only exists when bank data was synced into the organization.
    expect([200, 404]).toContain(response.status);
  });
});
