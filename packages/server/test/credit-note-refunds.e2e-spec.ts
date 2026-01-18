import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Credit Note Refunds (e2e)', () => {
  it('/credit-notes/:creditNoteId/refunds (GET)', () => {
    return request(app.getHttpServer())
      .get('/credit-notes/1/refunds')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
