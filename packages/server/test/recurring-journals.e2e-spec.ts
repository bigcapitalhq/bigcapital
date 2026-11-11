import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const today = () => new Date().toISOString().slice(0, 10);

const futureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const pastDate = (days: number) => futureDate(-days);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const enableFeature = (value: number) =>
  request(app.getHttpServer())
    .put('/settings')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      options: [{ group: 'features', key: 'recurring_journals', value }],
    });

const requestRecurringJournalBody = (
  overrides: Record<string, unknown> = {},
) => ({
  profileName: `Recurring journal ${faker.string.alphanumeric({ length: 8 })}`,
  startDate: today(),
  frequency: 'month',
  repeatInterval: 1,
  autoPublish: false,
  journalType: 'Journal',
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
  ...overrides,
});

describe('Recurring Journals (e2e)', () => {
  beforeAll(async () => {
    await enableFeature(1).expect(200);

    await request(app.getHttpServer())
      .put('/transactions-locking/cancel-lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ reason: 'Cancel lock for recurring journal e2e test' });
  });

  afterAll(async () => {
    await enableFeature(0).expect(200);
  });

  it('/recurring-journals (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/recurring-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringJournalBody())
      .expect(201);

    expect(response.body.profile_name).toBeDefined();
    expect(response.body.status).toBe('active');
    expect(response.body.entries).toHaveLength(2);
    expect(response.body.amount).toBe(1000);
  });

  it('exposes recurring journal resource meta and default views', async () => {
    const meta = await request(app.getHttpServer())
      .get('/resources/recurring_journals/meta')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(meta.body.fields.profile_name).toBeDefined();

    const views = await request(app.getHttpServer())
      .get('/views/resource/recurring_journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(views.body).toHaveLength(3);
    expect(views.body.map((view: any) => view.slug)).toEqual(
      expect.arrayContaining(['active', 'paused', 'completed']),
    );
  });

  it('/recurring-journals (GET)', async () => {
    await request(app.getHttpServer())
      .post('/recurring-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringJournalBody())
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/recurring-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('/recurring-journals/:id (PUT)', async () => {
    const recurring = await request(app.getHttpServer())
      .post('/recurring-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringJournalBody({ startDate: futureDate(30) }))
      .expect(201);

    const response = await request(app.getHttpServer())
      .put(`/recurring-journals/${recurring.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(
        requestRecurringJournalBody({
          startDate: futureDate(30),
          profileName: 'Updated recurring journal',
          frequency: 'week',
        }),
      )
      .expect(200);

    expect(response.body.profile_name).toBe('Updated recurring journal');
    expect(response.body.frequency).toBe('week');
  });

  it('generates a journal immediately and exposes child journals', async () => {
    const recurring = await request(app.getHttpServer())
      .post('/recurring-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringJournalBody({ startDate: futureDate(30) }))
      .expect(201);

    const generated = await request(app.getHttpServer())
      .post(`/recurring-journals/${recurring.body.id}/generate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(generated.body.id).toBeDefined();
    expect(generated.body.is_published).toBe(false);

    const journals = await request(app.getHttpServer())
      .get(`/recurring-journals/${recurring.body.id}/journals`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(journals.body.data).toHaveLength(1);
    expect(journals.body.data[0].id).toBe(generated.body.id);
  });

  it('publishes generated journals when autoPublish is enabled', async () => {
    const recurring = await request(app.getHttpServer())
      .post('/recurring-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(
        requestRecurringJournalBody({
          startDate: futureDate(30),
          autoPublish: true,
        }),
      )
      .expect(201);

    const generated = await request(app.getHttpServer())
      .post(`/recurring-journals/${recurring.body.id}/generate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(generated.body.is_published).toBe(true);
  });

  it('pauses and resumes a recurring journal', async () => {
    const recurring = await request(app.getHttpServer())
      .post('/recurring-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringJournalBody({ startDate: futureDate(30) }))
      .expect(201);

    const paused = await request(app.getHttpServer())
      .post(`/recurring-journals/${recurring.body.id}/pause`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(paused.body.status).toBe('paused');

    const resumed = await request(app.getHttpServer())
      .post(`/recurring-journals/${recurring.body.id}/resume`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(resumed.body.status).toBe('active');
  });

  it('generates a due journal in the background', async () => {
    const recurring = await request(app.getHttpServer())
      .post('/recurring-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(
        requestRecurringJournalBody({
          startDate: pastDate(1),
          frequency: 'day',
          maxOccurrences: 1,
        }),
      )
      .expect(201);

    let journals: any = { body: { data: [] } };
    for (let attempt = 0; attempt < 20; attempt++) {
      journals = await request(app.getHttpServer())
        .get(`/recurring-journals/${recurring.body.id}/journals`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      if (journals.body.data?.length > 0) {
        break;
      }
      await sleep(250);
    }

    expect(journals.body.data).toHaveLength(1);

    const profile = await request(app.getHttpServer())
      .get(`/recurring-journals/${recurring.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(profile.body.status).toBe('completed');
    expect(profile.body.next_journal_date).toBeNull();
  });

  it('keeps generated journals after deleting the profile', async () => {
    const recurring = await request(app.getHttpServer())
      .post('/recurring-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringJournalBody({ startDate: futureDate(30) }))
      .expect(201);

    const generated = await request(app.getHttpServer())
      .post(`/recurring-journals/${recurring.body.id}/generate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/recurring-journals/${recurring.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/manual-journals/${generated.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('rejects the endpoints when the feature is disabled', async () => {
    await enableFeature(0).expect(200);

    await request(app.getHttpServer())
      .get('/recurring-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(400);

    await enableFeature(1).expect(200);
  });
});
