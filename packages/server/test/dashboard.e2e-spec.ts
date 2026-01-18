import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Dashboard (e2e)', () => {
  it('/dashboard/boot (GET)', () => {
    return request(app.getHttpServer())
      .get('/dashboard/boot')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
