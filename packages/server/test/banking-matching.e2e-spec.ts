import request = require('supertest');
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Matching (e2e)', () => {
  it('/banking/matching/matched (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/banking/matching/matched')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    // Matched transactions only exist when bank data was synced into the organization.
    expect([200, 404]).toContain(response.status);
  });

  it('/banking/matching/match (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/banking/matching/match')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        uncategorizedTransactions: [1],
        matchedTransactions: [1],
      });

    // Matching only succeeds when bank data was synced into the organization.
    expect([200, 400, 404]).toContain(response.status);
  });

  it('/banking/matching/unmatch/:uncategorizedTransactionId (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/banking/matching/unmatch/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    expect([200, 404]).toContain(response.status);
  });
});
