import request = require('supertest');
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Attachments (e2e)', () => {
  it('/attachments/:id/presigned-url (GET)', () => {
    return request(app.getHttpServer())
      .get('/attachments/test-id/presigned-url')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
