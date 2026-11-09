import request = require('supertest');
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Subscriptions (e2e)', () => {
  it('/subscription (GET)', () => {
    return request(app.getHttpServer())
      .get('/subscription')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.subscriptions)).toBe(true);
      });
  });

  it('/subscription/plans (GET)', () => {
    return request(app.getHttpServer())
      .get('/subscription/plans')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.plans)).toBe(true);
      });
  });

  it('/subscription/stripe/checkout_session (POST) is Cloud-only', () => {
    return request(app.getHttpServer())
      .post('/subscription/stripe/checkout_session')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ plan_slug: 'capital-basic-monthly' })
      .expect(400)
      .expect((res) => {
        expect(res.body.errors?.[0]?.type).toBe('BILLING_NOT_AVAILABLE');
      });
  });
});
