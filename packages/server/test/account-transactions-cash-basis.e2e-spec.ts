import request = require('supertest');
import { faker } from '@faker-js/faker';
import { camelCase, mapKeys } from 'lodash';
import { app } from './init-app-test';
import {
  authHeaders,
  cancelTransactionsLock,
  createCustomer,
  getBaseCurrency,
} from './_utils/gl';

const camel = (row: Record<string, any>) =>
  mapKeys(row, (_value, key) => camelCase(key));

/**
 * A payment received writes its deposit line twice on the bank account: once
 * on the accrual basis and once per settled invoice on the cash basis. The
 * account transaction lists must show it once, like the account balance does.
 */
describe('Account transaction lists skip cash-basis rows (e2e)', () => {
  const date = '2034-03-10';

  let bankAccountId: number;
  let paymentId: number;

  const createItem = async () => {
    const res = await request(app.getHttpServer())
      .post('/items')
      .set(authHeaders())
      .send({
        name: `Cash basis list item ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
        type: 'service',
        unit: 'piece',
        sellable: true,
        purchasable: true,
        sellAccountId: 1026,
        costAccountId: 1019,
        costPrice: 100,
        sellPrice: 100,
      })
      .expect(201);
    return parseInt(res.body.id, 10);
  };

  const createInvoice = async (
    customerId: number,
    itemId: number,
    rate: number,
  ) => {
    const res = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set(authHeaders())
      .send({
        customerId,
        invoiceDate: date,
        dueDate: date,
        invoiceNo: faker.string.uuid(),
        delivered: true,
        branchId: 1,
        warehouseId: 1,
        entries: [{ index: 1, itemId, quantity: 1, rate }],
      })
      .expect(201);
    return res.body.id;
  };

  beforeAll(async () => {
    await cancelTransactionsLock();

    const account = await request(app.getHttpServer())
      .post('/accounts')
      .set(authHeaders())
      .send({
        name: `Cash basis list bank ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
        accountType: 'bank',
        code: faker.string.alphanumeric({ length: 6 }).toUpperCase(),
      })
      .expect(201);
    bankAccountId = account.body.id;

    const customerId = await createCustomer(await getBaseCurrency());
    const itemId = await createItem();
    const invoiceA = await createInvoice(customerId, itemId, 1000);
    const invoiceB = await createInvoice(customerId, itemId, 200);

    // One payment settling both invoices: 1 accrual + 2 cash-basis bank rows.
    const payment = await request(app.getHttpServer())
      .post('/payments-received')
      .set(authHeaders())
      .send({
        customerId,
        paymentDate: date,
        exchangeRate: 1,
        depositAccountId: bankAccountId,
        paymentReceiveNo: faker.string.uuid(),
        entries: [
          { index: 1, invoiceId: invoiceA, paymentAmount: 1000 },
          { index: 2, invoiceId: invoiceB, paymentAmount: 200 },
        ],
        branchId: 1,
      })
      .expect(201);
    paymentId = payment.body.id;
  });

  it('lists the payment once in the bank account transactions', async () => {
    const res = await request(app.getHttpServer())
      .get('/banking/transactions')
      .query({ accountId: bankAccountId })
      .set(authHeaders())
      .expect(200);

    const rows = (res.body.transactions ?? []).map(camel);
    const paymentRows = rows.filter(
      (row) =>
        row.referenceType === 'PaymentReceive' &&
        Number(row.referenceId) === Number(paymentId),
    );
    expect(paymentRows).toHaveLength(1);
    expect(Number(paymentRows[0].deposit)).toBe(1200);
  });

  it('ends the running balance at the account balance', async () => {
    const res = await request(app.getHttpServer())
      .get('/banking/transactions')
      .query({ accountId: bankAccountId })
      .set(authHeaders())
      .expect(200);

    const rows = (res.body.transactions ?? []).map(camel);
    expect(rows).toHaveLength(1);
    expect(Number(rows[0].runningBalance)).toBe(1200);
  });

  it('lists the payment once in the chart of accounts drawer', async () => {
    const res = await request(app.getHttpServer())
      .get('/accounts/transactions')
      .query({ accountId: bankAccountId })
      .set(authHeaders())
      .expect(200);

    // This endpoint responds with a plain array of rows.
    const rows = res.body.map(camel);
    const paymentRows = rows.filter(
      (row) =>
        row.transactionType === 'PaymentReceive' &&
        Number(row.transactionId) === Number(paymentId),
    );
    expect(paymentRows).toHaveLength(1);
    expect(Number(paymentRows[0].debit)).toBe(1200);
  });
});
