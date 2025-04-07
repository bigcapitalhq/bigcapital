import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const makeSettingsRequest = () => ({
  options: [
    {
      group: 'credit_note',
      key: 'customer_notes',
      value: 'Customer Notes...',
    },
    {
      group: 'credit_note',
      key: 'terms_conditions',
      value: 'Terms & Conditions...',
    },
  ],
});

describe('Settings (e2e)', () => {
  it('/settings (PUT)', () => {
    return request(app.getHttpServer())
      .put('/settings')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeSettingsRequest())
      .expect(200);
  });

  it('/settings (GET)', () => {
    return request(app.getHttpServer())
      .get('/settings')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
