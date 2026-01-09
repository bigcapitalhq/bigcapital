import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Payment Links (e2e)', () => {
  it('/payment-links/:paymentLinkId/invoice (GET)', () => {
    return request(app.getHttpServer())
      .get('/payment-links/test-link-id/invoice')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
