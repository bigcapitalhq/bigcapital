import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Resource (e2e)', () => {
  it('/resources/:resourceModel/meta (GET)', () => {
    return request(app.getHttpServer())
      .get('/resources/items/meta')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
