import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Credit Notes Apply Invoice (e2e)', () => {
  it('/credit-notes/:creditNoteId/applied-invoices (GET)', () => {
    return request(app.getHttpServer())
      .get('/credit-notes/1/applied-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
