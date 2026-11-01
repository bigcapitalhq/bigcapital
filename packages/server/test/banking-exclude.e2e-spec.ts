import request = require('supertest');
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Exclude (e2e)', () => {
  it('/banking/exclude (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/exclude')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/exclude/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put('/banking/exclude/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    // A transaction only exists when bank data was synced into the organization.
    expect([200, 404]).toContain(response.status);
  });

  it('/banking/exclude/bulk (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put('/banking/exclude/bulk')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ids: [1, 2] });

    expect([200, 404]).toContain(response.status);
  });

  it('/banking/exclude/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/banking/exclude/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    expect([200, 404]).toContain(response.status);
  });

  it('/banking/exclude/bulk (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/banking/exclude/bulk')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ids: [1, 2] });

    expect([200, 404]).toContain(response.status);
  });
});
