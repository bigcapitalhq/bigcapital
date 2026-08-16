import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Bill Landed Costs (e2e)', () => {
  beforeAll(async () => {
    await request(app.getHttpServer())
      .put('/settings')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        options: [{ group: 'features', key: 'landed_cost', value: 1 }],
      })
      .expect(200);
  });

  it('/landed-cost/transactions (GET)', () => {
    return request(app.getHttpServer())
      .get('/landed-cost/transactions')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/landed-cost/bills/:billId/transactions (GET)', () => {
    return request(app.getHttpServer())
      .get('/landed-cost/bills/1/transactions')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('should reject the landed cost endpoints when the feature is disabled', async () => {
    await request(app.getHttpServer())
      .put('/settings')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        options: [{ group: 'features', key: 'landed_cost', value: 0 }],
      })
      .expect(200);

    return request(app.getHttpServer())
      .get('/landed-cost/transactions')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(400);
  });
});
