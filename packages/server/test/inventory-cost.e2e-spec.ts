import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Inventory Cost (e2e)', () => {
  it('/inventory-cost/items (GET)', () => {
    return request(app.getHttpServer())
      .get('/inventory-cost/items')
      .query({ itemsIds: [1], date: '2023-01-01' })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
