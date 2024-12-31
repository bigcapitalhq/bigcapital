import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

const makeExpenseRequest = () => ({
  exchangeRate: 1,
  description: faker.lorem.sentence(),
  paymentAccountId: 1000,
  referenceNo: faker.string.alphanumeric(10),
  publish: true,
  paymentDate: faker.date.recent(),
  categories: [
    {
      expenseAccountId: 1045,
      amount: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
      description: faker.lorem.sentence(),
    },
  ],
  // currencyCode: faker.finance.currencyCode(),
  // userId: faker.number.int({ min: 1, max: 100 }),
  // payeeId: faker.number.int({ min: 1, max: 100 }),
  // branchId: faker.number.int({ min: 1, max: 100 }),
});

describe('Expenses (e2e)', () => {
  it('/expenses (POST)', () => {
    return request(app.getHttpServer())
      .post('/expenses')
      .set('organization-id', '4064541lv40nhca')
      .send(makeExpenseRequest())
      .expect(201);
  });

  it('/expenses/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/expenses')
      .set('organization-id', '4064541lv40nhca')
      .send(makeExpenseRequest());

    const expenseId = response.body.id;

    return request(app.getHttpServer())
      .get(`/expenses/${expenseId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/expenses/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/expenses')
      .set('organization-id', '4064541lv40nhca')
      .send(makeExpenseRequest());

    const expenseId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/expenses/${expenseId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
