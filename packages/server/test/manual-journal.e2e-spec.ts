import * as request from 'supertest';
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
