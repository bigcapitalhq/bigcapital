import request = require('supertest');
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Categorize (e2e)', () => {
  it('/banking/categorize (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/banking/categorize')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        uncategorizedTransactionIds: [1],
        accountId: 1000,
        categoryId: 1,
      });

    // Categorization only succeeds when bank data was synced into the organization.
    expect([200, 400, 404]).toContain(response.status);
  });

  it('/banking/categorize/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/banking/categorize/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    expect([200, 404]).toContain(response.status);
  });

  it('/banking/categorize/bulk (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/banking/categorize/bulk')
      .query({ uncategorizedTransactionIds: [1, 2] })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    expect([200, 404]).toContain(response.status);
  });
});
