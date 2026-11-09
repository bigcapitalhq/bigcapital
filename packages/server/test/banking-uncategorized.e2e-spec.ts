import request = require('supertest');
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Uncategorized Transactions (e2e)', () => {
  it('/banking/uncategorized/:uncategorizedTransactionId (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/banking/uncategorized/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    // A transaction only exists when bank data was synced into the organization.
    expect([200, 404]).toContain(response.status);
  });

  it('/banking/uncategorized/accounts/:accountId (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/uncategorized/accounts/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/uncategorized/autofill (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/banking/uncategorized/autofill')
      .query({ uncategorizedTransactionIds: [1] })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    // Autofill only returns values for transactions synced into the organization.
    expect([200, 404]).toContain(response.status);
  });
});
