import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Accounts (e2e)', () => {
  // it('/banking/accounts (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/banking/accounts')
  //     .set('organization-id', orgainzationId)
  //     .set('Authorization', AuthorizationHeader)
  //     .expect(200);
  // });

  // it('/banking/accounts/:bankAccountId/summary (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/banking/accounts/1/summary')
  //     .set('organization-id', orgainzationId)
  //     .set('Authorization', AuthorizationHeader)
  //     .expect(200);
  // });
});
