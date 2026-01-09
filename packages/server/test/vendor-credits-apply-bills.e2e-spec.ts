import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Vendor Credits Apply Bills (e2e)', () => {
  it('/vendor-credits/:vendorCreditId/bills-to-apply (GET)', () => {
    return request(app.getHttpServer())
      .get('/vendor-credits/1/bills-to-apply')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/vendor-credits/:vendorCreditId/applied-bills (GET)', () => {
    return request(app.getHttpServer())
      .get('/vendor-credits/1/applied-bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
