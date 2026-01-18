import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Import (e2e)', () => {
  it('/import/sample (GET)', () => {
    return request(app.getHttpServer())
      .get('/import/sample')
      .query({ resource: 'items', format: 'csv' })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
