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

describe('GL entries — Sales transactions (e2e)', () => {
  let baseCurrency: string;
  let customerId: number;
  let foreignCustomerId: number;
  let itemId: number;
  let taxRate10: number;

  beforeAll(async () => {
    await cancelTransactionsLock();

    baseCurrency = await getBaseCurrency();
    customerId = await createCustomer(baseCurrency);
    foreignCustomerId = await createCustomer('EUR');
    itemId = await createServiceItem();
    taxRate10 = await createTaxRate(10);
  });

  describe('Sale Invoice', () => {
    const createInvoice = async (overrides: Record<string, any> = {}) => {
      const res = await request(app.getHttpServer())
        .post('/sale-invoices')
        .set(authHeaders())
        .send({
          customerId,
          invoiceDate: '2023-01-01',
          dueDate: '2023-02-01',
          invoiceNo: faker.string.uuid(),
          referenceNo: 'REF-000201',
          delivered: true,
          discountType: 'percentage',
          discount: 10,
          branchId: 1,
          warehouseId: 1,
          entries: [
            {
              index: 1,
              itemId,
              quantity: 1,
              rate: 1000,
              description: 'Item description...',
            },
          ],
          ...overrides,
        })
        .expect(201);

      return res.body.id;
    };

    it('posts a balanced journal for a plain delivered invoice with discount', async () => {
      const invoiceId = await createInvoice();

      const legs = await fetchLegs('SaleInvoice', invoiceId);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '10007', contactId: customerId, debit: 900 },
          { accountCode: '50002', credit: 1000 },
          { accountCode: '40008', debit: 100 },
        ],
        'SaleInvoice',
      );
    });

    it('posts a balanced journal for a tax-exclusive invoice', async () => {
      const invoiceId = await createInvoice({
        entries: [
          {
            index: 1,
            itemId,
            quantity: 1,
            rate: 1000,
            taxRateId: taxRate10,
            description: 'Item description...',
          },
        ],
      });

      const legs = await fetchLegs('SaleInvoice', invoiceId);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '10007', contactId: customerId, debit: 1000 },
          { accountCode: '50002', credit: 1000 },
          { accountCode: '20006', credit: 100 },
          { accountCode: '40008', debit: 100 },
        ],
        'SaleInvoice',
      );
    });

    it('posts a balanced journal for a tax-inclusive invoice', async () => {
      const invoiceId = await createInvoice({
        isInclusiveTax: true,
        entries: [
          {
            index: 1,
            itemId,
            quantity: 1,
            rate: 1000,
            taxRateId: taxRate10,
            description: 'Item description...',
          },
        ],
      });

      const legs = await fetchLegs('SaleInvoice', invoiceId);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '10007', contactId: customerId, debit: 900 },
          { accountCode: '50002', credit: 909.09 },
          { accountCode: '20006', credit: 90.91 },
          { accountCode: '40008', debit: 100 },
        ],
        'SaleInvoice',
      );
    });

    it('posts a balanced journal for an invoice with adjustment', async () => {
      const invoiceId = await createInvoice({
        adjustment: 50,
      });

      const legs = await fetchLegs('SaleInvoice', invoiceId);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '10007', contactId: customerId, debit: 950 },
          { accountCode: '50002', credit: 1000 },
          { accountCode: '40008', debit: 100 },
          { accountCode: '40010', credit: 50 },
        ],
        'SaleInvoice',
      );
    });

    it('posts a balanced journal for a multi-currency tax-exclusive invoice', async () => {
      const invoiceId = await createInvoice({
        customerId: foreignCustomerId,
        exchangeRate: 1.2,
        entries: [
          {
            index: 1,
            itemId,
            quantity: 1,
            rate: 1000,
            taxRateId: taxRate10,
            description: 'Item description...',
          },
        ],
      });

      const legs = await fetchLegs('SaleInvoice', invoiceId);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { contactId: foreignCustomerId, debit: 1200 },
          { accountCode: '50002', credit: 1200 },
          { accountCode: '20006', credit: 120 },
          { accountCode: '40008', debit: 120 },
        ],
        'SaleInvoice',
      );
    });
  });

  describe('Sale Receipt', () => {
    it('posts a balanced journal for a closed sale receipt with discount', async () => {
      const res = await request(app.getHttpServer())
        .post('/sale-receipts')
        .set(authHeaders())
        .send({
          customerId,
          depositAccountId: 1000,
          receiptDate: '2022-02-02',
          receiptNumber: faker.string.uuid(),
          referenceNo: '123',
          closed: true,
          discount: 100,
          discountType: 'amount',
          branchId: 1,
          warehouseId: 1,
          entries: [
            {
              index: 1,
              itemId,
              quantity: 1,
              rate: 2000,
              description: 'asdfsadf',
            },
          ],
        })
        .expect(201);

      const legs = await fetchLegs('SaleReceipt', res.body.id);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '10001', debit: 1900 },
          { accountCode: '50002', credit: 2000 },
          { accountCode: '40008', debit: 100 },
        ],
        'SaleReceipt',
      );
    });
  });

  describe('Payment Received', () => {
    it('posts a balanced journal for a payment received against an invoice', async () => {
      const invoiceRes = await request(app.getHttpServer())
        .post('/sale-invoices')
        .set(authHeaders())
        .send({
          customerId,
          invoiceDate: '2023-01-01',
          dueDate: '2023-02-01',
          invoiceNo: faker.string.uuid(),
          referenceNo: 'REF-000201',
          delivered: true,
          branchId: 1,
          warehouseId: 1,
          entries: [
            {
              index: 1,
              itemId,
              quantity: 1,
              rate: 1000,
              description: 'Item description...',
            },
          ],
        })
        .expect(201);

      const paymentRes = await request(app.getHttpServer())
        .post('/payments-received')
        .set(authHeaders())
        .send({
          customerId,
          paymentDate: '2023-01-01',
          exchangeRate: 1,
          referenceNo: faker.string.uuid(),
          depositAccountId: 1000,
          paymentReceiveNo: faker.string.uuid(),
          statement: 'Payment received for invoice',
          entries: [
            { index: 1, invoiceId: invoiceRes.body.id, paymentAmount: 1000 },
          ],
          branchId: 1,
        })
        .expect(201);

      const legs = await fetchLegs('PaymentReceive', paymentRes.body.id);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '10001', debit: 1000 },
          { accountCode: '10007', contactId: customerId, credit: 1000 },
        ],
        'PaymentReceive',
      );
    });
  });

  describe('Credit Note', () => {
    it('posts a balanced journal for an opened credit note with discount', async () => {
      const res = await request(app.getHttpServer())
        .post('/credit-notes')
        .set(authHeaders())
        .send({
          customerId,
          creditNoteDate: '2020-02-02',
          open: true,
          branchId: 1,
          warehouseId: 1,
          entries: [
            {
              index: 1,
              itemId,
              quantity: 1,
              rate: 1000,
              description: "It's description here.",
            },
          ],
          discount: '100',
          discountType: 'amount',
        })
        .expect(201);

      const legs = await fetchLegs('CreditNote', res.body.id);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '10007', contactId: customerId, credit: 900 },
          { accountCode: '50002', debit: 1000 },
          { accountCode: '40008', credit: 100 },
        ],
        'CreditNote',
      );
    });
  });

  describe('Sale Invoice Write-off', () => {
    it('posts a balanced journal for an invoice write-off', async () => {
      const invoiceRes = await request(app.getHttpServer())
        .post('/sale-invoices')
        .set(authHeaders())
        .send({
          customerId,
          invoiceDate: '2023-01-01',
          dueDate: '2023-02-01',
          invoiceNo: faker.string.uuid(),
          referenceNo: 'REF-000201',
          delivered: true,
          branchId: 1,
          warehouseId: 1,
          entries: [
            {
              index: 1,
              itemId,
              quantity: 1,
              rate: 1000,
              description: 'Item description...',
            },
          ],
        })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/sale-invoices/${invoiceRes.body.id}/writeoff`)
        .set(authHeaders())
        .send({
          expenseAccountId: 1024,
          date: '2023-01-01',
          reason: 'Write off reason',
        })
        .expect(200);

      const legs = await fetchLegs('InvoiceWriteOff', invoiceRes.body.id);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '40007', debit: 1000 },
          { accountCode: '10007', contactId: customerId, credit: 1000 },
        ],
        'InvoiceWriteOff',
      );
    });
  });
});
