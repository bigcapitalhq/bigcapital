import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Uncategorized Transactions (e2e)', () => {
  it('/banking/uncategorized/:uncategorizedTransactionId (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/uncategorized/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/uncategorized/accounts/:accountId (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/uncategorized/accounts/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/uncategorized/autofill (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/uncategorized/autofill')
      .query({ uncategorizedTransactionIds: [1] })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
