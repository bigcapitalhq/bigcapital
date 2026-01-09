import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Categorize (e2e)', () => {
  it('/banking/categorize (POST)', () => {
    return request(app.getHttpServer())
      .post('/banking/categorize')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        uncategorizedTransactionIds: [1],
        accountId: 1000,
        categoryId: 1,
      })
      .expect(200);
  });

  it('/banking/categorize/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/banking/categorize/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/categorize/bulk (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/banking/categorize/bulk')
      .query({ uncategorizedTransactionIds: [1, 2] })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
