
import * as request from 'supertest';
import { app } from './init-app-test';

describe('Transactions Locking (e2e)', () => {
  it('/transactions-locking (PUT)', () => {
    return request(app.getHttpServer())
      .put('/transactions-locking')
      .set('organization-id', '4064541lv40nhca')
      .send({
        module: 'all',
        lock_to_date: '2025-01-01',
        reason: 'test',
      })
      .expect(200);
  });
});