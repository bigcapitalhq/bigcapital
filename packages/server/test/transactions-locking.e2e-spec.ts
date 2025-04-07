import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Transactions Locking (e2e)', () => {
  afterAll(() => {
    return request(app.getHttpServer())
      .put('/transactions-locking/cancel-lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);
  });

  it('/transactions-locking/lock (PUT)', () => {
    return request(app.getHttpServer())
      .put('/transactions-locking/lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        module: 'all',
        lock_to_date: '2025-01-01',
        reason: 'test',
      })
      .expect(200);
  });

  it('/transactions-locking/cancel-lock (PUT)', async () => {
    await request(app.getHttpServer())
      .put('/transactions-locking/lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        module: 'all',
        lock_to_date: '2025-01-01',
        reason: 'test',
      })
      .expect(200);

    return request(app.getHttpServer())
      .put('/transactions-locking/cancel-lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/transactions-locking/unlock-partial (PUT)', async () => {
    await request(app.getHttpServer())
      .put('/transactions-locking/lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        module: 'all',
        lock_to_date: '2025-01-01',
        reason: 'test',
      })
      .expect(200);

    return request(app.getHttpServer())
      .put('/transactions-locking/cancel-lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        module: 'all',
        unlockFromDate: '2025-01-01',
        unlockToDate: '2025-12-31',
        reason: 'test partial unlock',
      })
      .expect(200);
  });

  it('/transactions-locking/cancel-unlock-partial (PUT)', async () => {
    await request(app.getHttpServer())
      .put('/transactions-locking/lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        module: 'all',
        lock_to_date: '2025-01-01',
        reason: 'test',
      })
      .expect(200);

    await request(app.getHttpServer())
      .put('/transactions-locking/unlock-partial')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        module: 'all',
        unlockFromDate: '2025-01-01',
        unlockToDate: '2025-12-31',
        reason: 'test partial unlock',
      })
      .expect(200);

    return request(app.getHttpServer())
      .put('/transactions-locking/cancel-unlock-partial')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        module: 'all',
        unlockFromDate: '2025-01-01',
        unlockToDate: '2025-12-31',
        reason: 'test partial unlock',
      })
      .expect(200);
  });

  it('/transactions-locking (GET)', () => {
    return request(app.getHttpServer())
      .get('/transactions-locking')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/transactions-locking/:module (GET)', () => {
    return request(app.getHttpServer())
      .get('/transactions-locking/all')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
