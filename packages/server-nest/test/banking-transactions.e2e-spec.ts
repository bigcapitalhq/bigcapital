import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

const createOwnerContributionTransaction = () => ({
  date: '2024-01-01',
  transactionNumber: faker.string.alphanumeric(10),
  referenceNo: faker.string.alphanumeric(8),
  transactionType: 'owner_contribution',
  description: faker.lorem.sentence(),
  amount: faker.number.float({ min: 100, max: 10000, precision: 2 }),
  // exchangeRate: 1,
  // currencyCode: 'USD',
  creditAccountId: 1014,
  cashflowAccountId: 1000,
  publish: true,
  branchId: 1,
  // plaidTransactionId: faker.string.uuid()
});

describe('Banking Transactions (e2e)', () => {
  it('/banking/transactions (POST)', () => {
    return request(app.getHttpServer())
      .post('/banking/transactions')
      .set('organization-id', '4064541lv40nhca')
      .send(createOwnerContributionTransaction())
      .expect(201);
  });

  it('/banking/transactions/:id (GET)', async () => {
    const transaction = createOwnerContributionTransaction();
    const response = await request(app.getHttpServer())
      .post('/banking/transactions')
      .set('organization-id', '4064541lv40nhca')
      .send(transaction)
      .expect(201);

    const transactionId = response.body.id;

    return request(app.getHttpServer())
      .get(`/banking/transactions/${transactionId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/banking/transactions/:id (DELETE)', async () => {
    const transaction = createOwnerContributionTransaction();
    const response = await request(app.getHttpServer())
      .post('/banking/transactions')
      .set('organization-id', '4064541lv40nhca')
      .send(transaction)
      .expect(201);

    const transactionId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/banking/transactions/${transactionId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
