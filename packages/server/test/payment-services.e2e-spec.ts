import request = require('supertest');
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

  it('/payment-services/:paymentServiceId (GET)', async () => {
    const listResponse = await request(app.getHttpServer())
      .get('/payment-services')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    if (listResponse.body.length > 0) {
      return request(app.getHttpServer())
        .get(`/payment-services/${listResponse.body[0].id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);
    }
  });
});
