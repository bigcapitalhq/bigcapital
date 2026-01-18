import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Recognized Transactions (e2e)', () => {
  it('/banking/recognized (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/recognized')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/recognized/:recognizedTransactionId (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/recognized/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
