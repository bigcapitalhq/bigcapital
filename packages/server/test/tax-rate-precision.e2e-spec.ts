import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';
import {
  authHeaders,
  cancelTransactionsLock,
  createCustomer,
  createServiceItem,
  createTaxRate,
  expectBalanced,
  expectLegs,
  fetchLegs,
  getBaseCurrency,
} from './_utils/gl';

/**
 * A tax rate with three decimals (14.975 % = Québec GST 5 % + QST 9.975 %) must
 * reach the document line, the ledger and the tax report without being rounded
 * to 14.98 %. A 1,000 line makes the difference visible without any cent
 * rounding: 149.75 of tax at 14.975 %, 149.80 at 14.98 %.
 */
describe('Tax rates with more than two decimals (e2e)', () => {
  let customerId: number;
  let itemId: number;
  let taxRateId: number;
  let invoiceId: number;

  beforeAll(async () => {
    await cancelTransactionsLock();

    const baseCurrency = await getBaseCurrency();
    customerId = await createCustomer(baseCurrency);
    itemId = await createServiceItem();
    taxRateId = await createTaxRate(14.975);

    const res = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set(authHeaders())
      .send({
        customerId,
        invoiceDate: '2023-01-01',
        dueDate: '2023-02-01',
        invoiceNo: faker.string.uuid(),
        delivered: true,
        branchId: 1,
        warehouseId: 1,
        entries: [
          {
            index: 1,
            itemId,
            quantity: 1,
            rate: 1000,
            taxRateId,
            description: 'Storage',
          },
        ],
      })
      .expect(201);

    invoiceId = res.body.id;
  });

  it('copies the exact rate onto the invoice line', async () => {
    const res = await request(app.getHttpServer())
      .get(`/sale-invoices/${invoiceId}`)
      .set(authHeaders())
      .expect(200);

    expect(Number(res.body.entries[0].tax_rate)).toBe(14.975);
  });

  it('posts the tax of the exact rate to the ledger', async () => {
    const legs = await fetchLegs('SaleInvoice', invoiceId);

    expectBalanced(legs);
    expectLegs(
      legs,
      [
        { accountCode: '10007', contactId: customerId, debit: 1149.75 },
        { accountCode: '50002', credit: 1000 },
        { accountCode: '20006', credit: 149.75 },
      ],
      'SaleInvoice',
    );
  });

  it('reports the exact rate and its tax in the sales tax liability summary', async () => {
    const res = await request(app.getHttpServer())
      .get('/reports/sales-tax-liability-summary')
      .query({ fromDate: '2023-01-01', toDate: '2023-12-31', basis: 'accrual' })
      .set(authHeaders())
      .expect(200);

    const row = res.body.data.tax_rates.find(
      (taxRate) => taxRate.id === taxRateId,
    );

    expect(row.tax_name).toMatch(/\(14\.975%\)$/);
    expect(row.taxable_amount.amount).toBe(1000);
    expect(row.tax_amount.amount).toBe(149.75);
  });
});
