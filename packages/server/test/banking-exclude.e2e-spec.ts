import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Exclude (e2e)', () => {
  it('/banking/exclude (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/exclude')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/exclude/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/banking/exclude/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/exclude/bulk (PUT)', () => {
    return request(app.getHttpServer())
      .put('/banking/exclude/bulk')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ids: [1, 2] })
      .expect(200);
  });

  it('/banking/exclude/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/banking/exclude/1')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/exclude/bulk (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/banking/exclude/bulk')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ids: [1, 2] })
      .expect(200);
  });
});
