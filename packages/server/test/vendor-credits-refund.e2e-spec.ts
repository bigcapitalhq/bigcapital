import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Vendor Credits Refund (e2e)', () => {
  it('/vendor-credits/:vendorCreditId/refund (GET)', () => {
    return request(app.getHttpServer())
      .get('/vendor-credits/1/refund')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
