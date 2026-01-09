import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Payment Services (e2e)', () => {
  it('/payment-services (GET)', () => {
    return request(app.getHttpServer())
      .get('/payment-services')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/payment-services/state (GET)', () => {
    return request(app.getHttpServer())
      .get('/payment-services/state')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/payment-services/:paymentServiceId (GET)', () => {
    return request(app.getHttpServer())
      .get('/payment-services/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
