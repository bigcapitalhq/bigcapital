import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const createTrackingCategory = async (
  options = ['North Store', 'South Store'],
) => {
  const response = await request(app.getHttpServer())
    .post('/tracking-categories')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      name: `Location ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
      options: options.map((name) => ({ name })),
    })
    .expect(201);

  return response.body;
};

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

    const getResponse = await request(app.getHttpServer())
      .get(`/manual-journals/${journalId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send()
      .expect(200);

    // `DATE` columns are served as `YYYY-MM-DD` calendar dates, while
    // timestamp columns keep their full ISO datetime.
    expect(getResponse.body.date).toBe('2022-06-01');
    expect(getResponse.body.created_at).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    );
    // A journal without an explicit accounting basis is general.
    expect(getResponse.body.basis).toBeNull();

    return getResponse;
  });

  it('/manual-journals (POST) persists the accounting basis', async () => {
    const response = await request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ...makeManualJournalRequest(), basis: 'cash' })
      .expect(201);

    const getResponse = await request(app.getHttpServer())
      .get(`/manual-journals/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send()
      .expect(200);

    expect(getResponse.body.basis).toBe('cash');
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

  it('/manual-journals (POST) persists tracking categories and edits them', async () => {
    const category = await createTrackingCategory();
    const firstOptionId = category.options[0].id;
    const secondOptionId = category.options[1].id;

    const createPayload = {
      ...makeManualJournalRequest(),
      entries: [
        {
          index: 1,
          credit: 1000,
          debit: 0,
          accountId: 1003,
          trackingCategories: [
            { categoryId: category.id, optionId: firstOptionId },
          ],
        },
        {
          index: 2,
          credit: 0,
          debit: 1000,
          accountId: 1004,
          trackingCategories: [
            { categoryId: category.id, optionId: secondOptionId },
          ],
        },
      ],
    };

    const created = await request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createPayload)
      .expect(201);

    const journalId = created.body.id;

    const getResponse = await request(app.getHttpServer())
      .get(`/manual-journals/${journalId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(getResponse.body.entries[0].tracking_categories).toHaveLength(1);
    expect(getResponse.body.entries[0].tracking_categories[0]).toMatchObject({
      category_id: category.id,
      option_id: firstOptionId,
    });
    expect(getResponse.body.entries[1].tracking_categories[0]).toMatchObject({
      category_id: category.id,
      option_id: secondOptionId,
    });

    const editPayload = {
      ...createPayload,
      entries: [
        {
          index: 1,
          credit: 1000,
          debit: 0,
          accountId: 1003,
          trackingCategories: [
            { categoryId: category.id, optionId: secondOptionId },
          ],
        },
        {
          index: 2,
          credit: 0,
          debit: 1000,
          accountId: 1004,
          trackingCategories: [],
        },
      ],
    };

    await request(app.getHttpServer())
      .put(`/manual-journals/${journalId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(editPayload)
      .expect(200);

    const edited = await request(app.getHttpServer())
      .get(`/manual-journals/${journalId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(edited.body.entries[0].tracking_categories[0].option_id).toBe(
      secondOptionId,
    );
    expect(edited.body.entries[1].tracking_categories).toHaveLength(0);

    await request(app.getHttpServer())
      .delete(`/manual-journals/${journalId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/tracking-categories/${category.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('preserves archived tracking assignments and blocks new ones', async () => {
    const category = await createTrackingCategory();
    const optionId = category.options[0].id;

    const payload = {
      ...makeManualJournalRequest(),
      entries: makeManualJournalRequest().entries.map((entry, index) => ({
        ...entry,
        ...(index === 0
          ? {
              trackingCategories: [{ categoryId: category.id, optionId }],
            }
          : {}),
      })),
    };

    const created = await request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(payload)
      .expect(201);

    const journalId = created.body.id;

    await request(app.getHttpServer())
      .put(`/tracking-categories/${category.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ active: false })
      .expect(200);

    const archivedJournal = await request(app.getHttpServer())
      .get(`/manual-journals/${journalId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(
      archivedJournal.body.entries[0].tracking_categories[0].option_id,
    ).toBe(optionId);

    // Editing the journal must keep the archived assignment.
    await request(app.getHttpServer())
      .put(`/manual-journals/${journalId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(payload)
      .expect(200);

    const rejectedCreate = await request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...payload,
        journalNumber: faker.string.uuid(),
        reference: faker.string.uuid(),
      })
      .expect(400);

    expect(rejectedCreate.body.errors[0].type).toBe(
      'INACTIVE_TRACKING_CATEGORY',
    );

    const rejectedDelete = await request(app.getHttpServer())
      .delete(`/tracking-categories/${category.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(400);

    expect(rejectedDelete.body.errors[0].type).toBe(
      'TRACKING_CATEGORY_HAS_ASSIGNMENTS',
    );

    await request(app.getHttpServer())
      .delete(`/manual-journals/${journalId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('preserves archived option assignments and blocks new ones', async () => {
    const category = await createTrackingCategory();
    const archivedOptionId = category.options[0].id;
    const activeOptionId = category.options[1].id;

    const payload = {
      ...makeManualJournalRequest(),
      entries: [
        {
          index: 1,
          credit: 1000,
          debit: 0,
          accountId: 1003,
          trackingCategories: [
            { categoryId: category.id, optionId: archivedOptionId },
          ],
        },
        {
          index: 2,
          credit: 0,
          debit: 1000,
          accountId: 1004,
        },
      ],
    };

    const created = await request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(payload)
      .expect(201);

    await request(app.getHttpServer())
      .put(`/tracking-categories/${category.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        options: [
          { id: archivedOptionId, name: 'North Store', active: false },
          { id: activeOptionId, name: 'South Store', active: true },
        ],
      })
      .expect(200);

    // Editing the journal must keep the archived option assignment.
    await request(app.getHttpServer())
      .put(`/manual-journals/${created.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(payload)
      .expect(200);

    const rejectedCreate = await request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...payload,
        journalNumber: faker.string.uuid(),
        reference: faker.string.uuid(),
      })
      .expect(400);

    expect(rejectedCreate.body.errors[0].type).toBe(
      'INACTIVE_TRACKING_CATEGORY_OPTION',
    );

    await request(app.getHttpServer())
      .delete(`/manual-journals/${created.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('blocks removing a tracking option that is in use', async () => {
    const category = await createTrackingCategory();
    const usedOptionId = category.options[0].id;
    const remainingOptionId = category.options[1].id;

    const payload = {
      ...makeManualJournalRequest(),
      entries: [
        {
          index: 1,
          credit: 1000,
          debit: 0,
          accountId: 1003,
          trackingCategories: [
            { categoryId: category.id, optionId: usedOptionId },
          ],
        },
        {
          index: 2,
          credit: 0,
          debit: 1000,
          accountId: 1004,
        },
      ],
    };

    const created = await request(app.getHttpServer())
      .post('/manual-journals')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(payload)
      .expect(201);

    const rejectedEdit = await request(app.getHttpServer())
      .put(`/tracking-categories/${category.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        options: [{ id: remainingOptionId, name: 'South Store' }],
      })
      .expect(400);

    expect(rejectedEdit.body.errors[0].type).toBe(
      'TRACKING_CATEGORY_OPTION_HAS_ASSIGNMENTS',
    );

    await request(app.getHttpServer())
      .delete(`/manual-journals/${created.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
