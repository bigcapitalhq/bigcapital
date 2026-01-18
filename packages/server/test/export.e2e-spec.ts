import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Export (e2e)', () => {
  it('/export (GET)', () => {
    return request(app.getHttpServer())
      .get('/export')
      .query({ resource: 'items' })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .set('Accept', 'application/json')
      .expect(200);
  });
});
