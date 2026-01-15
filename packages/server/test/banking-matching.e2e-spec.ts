import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Matching (e2e)', () => {
  it('/banking/matching/matched (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/matching/matched')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/matching/match (POST)', () => {
    return request(app.getHttpServer())
      .post('/banking/matching/match')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        uncategorizedTransactions: [1],
        matchedTransactions: [1],
      })
      .expect(200);
  });

  it('/banking/matching/unmatch/:uncategorizedTransactionId (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/banking/matching/unmatch/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
