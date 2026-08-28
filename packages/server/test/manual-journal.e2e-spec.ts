import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const makeManualJournalRequest = () => ({
  date: '2022-06-01',
  reference: faker.string.uuid(),
  journalNumber: faker.string.uuid(),
  publish: false,
  entries: [
    {
      index: 1,
      credit: 1000,
      debit: 0,
      accountId: 1003,
    },
    {
      index: 2,
      credit: 0,
      debit: 1000,
      accountId: 1004,
    },
  ],
});

describe('Manual Journals (e2e)', () => {
  it('/manual-journals (POST)', () => {
    return request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeManualJournalRequest())
      .expect(201);
  });

  it('/manual-journals/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeManualJournalRequest());

    const journalId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/manual-journals/${journalId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send()
      .expect(200);
  });

  it('/manual-journals/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeManualJournalRequest());

    const journalId = response.body.id;

    return request(app.getHttpServer())
      .get(`/manual-journals/${journalId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send()
      .expect(200);
  });

  it('/manual-journals/:id (PUT)', async () => {
    const manualJournal = makeManualJournalRequest();
    const response = await request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(manualJournal);

    const journalId = response.body.id;

    return request(app.getHttpServer())
      .put(`/manual-journals/${journalId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(manualJournal)
      .expect(200);
  });

  it('/manual-journals (GET) honors page and pageSize query params', async () => {
    const response = await request(app.getHttpServer())
      .get('/manual-journals?page=2&pageSize=5')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(response.body.pagination).toBeDefined();
    expect(response.body.pagination.page).toBe(2);
    expect(response.body.pagination.page_size).toBe(5);
    // Ensure data array present
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('/manual-journals (GET) defaults to page 1 pageSize 12 when params absent', async () => {
    const response = await request(app.getHttpServer())
      .get('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(response.body.pagination).toBeDefined();
    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.page_size).toBe(12);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('/manual-journals/:id/publish (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeManualJournalRequest());

    const journalId = response.body.id;

    return request(app.getHttpServer())
      .patch(`/manual-journals/${journalId}/publish`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send()
      .expect(200);
  });
});
