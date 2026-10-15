import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const makeBudgetRequest = () => ({
  name: faker.string.uuid(),
  description: 'The annual budget of test.',
  fromDate: '2024-01-01',
  toDate: '2024-12-31',
  entries: [
    { accountId: 1003, date: '2024-01-01', amount: 1000 },
    { accountId: 1003, date: '2024-02-01', amount: 1000 },
    { accountId: 1004, date: '2024-01-01', amount: 2000 },
  ],
});

const createBudget = async () => {
  const response = await request(app.getHttpServer())
    .post('/budgets')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send(makeBudgetRequest());

  return response.body;
};

describe('Budgets (e2e)', () => {
  it('/budgets (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/budgets')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeBudgetRequest())
      .expect(201);

    expect(response.body.name).toBeDefined();
    expect(response.body.entries).toHaveLength(3);
    expect(response.body.formatted_from_date).toBeDefined();
    expect(response.body.total_budget_amount).toEqual(4000);
  });

  it('/budgets/:id (GET)', async () => {
    const budget = await createBudget();

    const response = await request(app.getHttpServer())
      .get(`/budgets/${budget.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(response.body.id).toEqual(budget.id);
    expect(response.body.entries.length).toBeGreaterThan(0);
    expect(response.body.entries[0].account_name).toBeDefined();
  });

  it('/budgets (GET) returns the paginated list', async () => {
    const budget = await createBudget();

    const response = await request(app.getHttpServer())
      .get(
        `/budgets?page=1&pageSize=5&searchKeyword=${encodeURIComponent(budget.name)}`,
      )
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(response.body.pagination).toBeDefined();
    expect(response.body.pagination.page).toBe(1);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].total_budget_amount).toEqual(4000);
  });

  it('/budgets/:id (PUT)', async () => {
    const budget = await createBudget();
    const editedBudget = {
      ...makeBudgetRequest(),
      entries: [
        { accountId: 1004, date: '2024-03-01', amount: 500 },
        { accountId: 1004, date: '2024-04-01', amount: 500 },
      ],
    };
    const response = await request(app.getHttpServer())
      .put(`/budgets/${budget.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(editedBudget)
      .expect(200);

    expect(response.body.id).toEqual(budget.id);
    expect(response.body.entries).toHaveLength(2);
    expect(response.body.total_budget_amount).toEqual(1000);
  });

  it('/budgets/:id (DELETE)', async () => {
    const budget = await createBudget();

    await request(app.getHttpServer())
      .delete(`/budgets/${budget.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get(`/budgets?searchKeyword=${budget.name}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(response.body.data).toHaveLength(0);
  });

  it('/budgets (POST) should reject entries outside the budget date range', () => {
    const budget = {
      ...makeBudgetRequest(),
      entries: [{ accountId: 1003, date: '2025-01-01', amount: 1000 }],
    };
    return request(app.getHttpServer())
      .post('/budgets')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(budget)
      .expect(400);
  });

  it('/budgets (POST) should reject non-existing accounts', () => {
    const budget = {
      ...makeBudgetRequest(),
      entries: [{ accountId: 999999, date: '2024-01-01', amount: 1000 }],
    };
    return request(app.getHttpServer())
      .post('/budgets')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(budget)
      .expect(400);
  });

  it('/budgets (POST) should reject duplicate account/month entries', () => {
    const budget = {
      ...makeBudgetRequest(),
      entries: [
        { accountId: 1003, date: '2024-01-01', amount: 1000 },
        { accountId: 1003, date: '2024-01-15', amount: 1000 },
      ],
    };
    return request(app.getHttpServer())
      .post('/budgets')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(budget)
      .expect(400);
  });

  it('/reports/budget-vs-actual (GET)', async () => {
    const budget = await createBudget();

    const response = await request(app.getHttpServer())
      .get('/reports/budget-vs-actual')
      .query({ budgetId: budget.id, displayColumnsBy: 'month' })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.periods).toHaveLength(12);
    expect(response.body.data.accounts.length).toBeGreaterThan(0);
    expect(response.body.data.totals.total.budget).toEqual(4000);

    // The variance should equal the actual minus the budget and the
    // percentage should equal the variance over the budget.
    const total = response.body.data.totals.total;
    expect(total.variance).toEqual(total.actual - total.budget);
    expect(total.percentage).toEqual(
      total.budget !== 0 ? total.variance / total.budget : 0,
    );
    expect(response.body.meta.budget_name).toEqual(budget.name);
  });

  it('/reports/budget-vs-actual (GET) with table accept type', async () => {
    const budget = await createBudget();

    const response = await request(app.getHttpServer())
      .get('/reports/budget-vs-actual')
      .query({ budgetId: budget.id })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .set('Accept', 'application/json+table')
      .expect(200);

    expect(response.body.table).toBeDefined();
    expect(response.body.table.columns.length).toBeGreaterThan(0);
    expect(response.body.table.rows.length).toBeGreaterThan(0);
  });

  it('/reports/budget-vs-actual (GET) with CSV accept type', async () => {
    const budget = await createBudget();

    const response = await request(app.getHttpServer())
      .get('/reports/budget-vs-actual')
      .query({ budgetId: budget.id })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .set('Accept', 'application/csv')
      .expect(200);

    expect(response.headers['content-type']).toContain('text/csv');
    expect(response.text.split('\n').length).toBeGreaterThan(3);
  });

  it('/reports/budget-vs-actual (GET) with XLSX accept type', async () => {
    const budget = await createBudget();

    const response = await request(app.getHttpServer())
      .get('/reports/budget-vs-actual')
      .query({ budgetId: budget.id })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .set('Accept', 'application/xlsx')
      .buffer(true)
      .parse((message, callback) => {
        const chunks: Buffer[] = [];
        message.on('data', (chunk) => chunks.push(chunk));
        message.on('end', () => callback(null, Buffer.concat(chunks)));
      })
      .expect(200)
      .expect(
        'Content-Type',
        /application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/,
      );

    expect(Buffer.isBuffer(response.body)).toBe(true);
  });
});
