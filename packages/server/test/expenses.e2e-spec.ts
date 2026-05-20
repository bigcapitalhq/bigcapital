import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const makeExpenseRequest = () => ({
  exchangeRate: 1,
  description: faker.lorem.sentence(),
  paymentAccountId: 1000,
  referenceNo: faker.string.alphanumeric(10),
  publish: true,
  paymentDate: faker.date.recent(),
  categories: [
    {
      expenseAccountId: 1021,
      amount: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
      description: faker.lorem.sentence(),
    },
  ],
  branchId: 1,
});

describe('Expenses (e2e)', () => {
  it('/expenses (POST)', () => {
    return request(app.getHttpServer())
      .post('/expenses')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeExpenseRequest())
      .expect(201);
  });

  it('/expenses/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/expenses')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeExpenseRequest());

    const expenseId = response.body.id;

    return request(app.getHttpServer())
      .put(`/expenses/${expenseId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeExpenseRequest())
      .expect(200);
  });

  it('/expenses/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/expenses')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeExpenseRequest());

    const expenseId = response.body.id;

    return request(app.getHttpServer())
      .get(`/expenses/${expenseId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/expenses/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/expenses')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeExpenseRequest());

    const expenseId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/expenses/${expenseId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/expenses (GET) honors page and pageSize query params', async () => {
    const response = await request(app.getHttpServer())
      .get('/expenses?page=2&pageSize=5')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(response.body.pagination).toBeDefined();
    expect(response.body.pagination.page).toBe(2);
    expect(response.body.pagination.page_size).toBe(5);
  });
});
