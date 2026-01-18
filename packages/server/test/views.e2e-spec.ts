import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Views (e2e)', () => {
  it('/views/resource/:resourceModel (GET)', () => {
    return request(app.getHttpServer())
      .get('/views/resource/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
