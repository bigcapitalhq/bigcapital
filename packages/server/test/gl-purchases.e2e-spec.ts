import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';
import {
  authHeaders,
  cancelTransactionsLock,
  createServiceItem,
  createTaxRate,
  createVendor,
  expectBalanced,
  expectLegs,
  fetchLegs,
  getBaseCurrency,
} from './_utils/gl';

describe('GL entries — Purchases transactions (e2e)', () => {
  let baseCurrency: string;
  let vendorId: number;
  let foreignVendorId: number;
  let itemId: number;
  let taxRate10: number;

  beforeAll(async () => {
    await cancelTransactionsLock();

    baseCurrency = await getBaseCurrency();
    vendorId = await createVendor(baseCurrency);
    foreignVendorId = await createVendor('EUR');
    itemId = await createServiceItem();
    taxRate10 = await createTaxRate(10);
  });

  describe('Bill', () => {
    const createBill = async (overrides: Record<string, any> = {}) => {
      const res = await request(app.getHttpServer())
        .post('/bills')
        .set(authHeaders())
        .send({
          vendorId,
          billDate: '2023-01-01',
          dueDate: '2023-02-01',
          billNumber: faker.string.alphanumeric(10),
          referenceNo: 'REF-000201',
          open: true,
          discountType: 'percentage',
          discount: 10,
          branchId: 1,
          warehouseId: 1,
          entries: [
            {
              index: 1,
              itemId,
              quantity: 2,
              rate: 1000,
              description: 'Item description...',
            },
          ],
          ...overrides,
        })
        .expect(201);

      return res.body.id;
    };

    it('posts a balanced journal for a plain opened bill with discount', async () => {
      const billId = await createBill();

      const legs = await fetchLegs('Bill', billId);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '20001', contactId: vendorId, credit: 1800 },
          { accountCode: '40002', debit: 2000 },
          { accountCode: '40009', credit: 200 },
        ],
        'Bill',
      );
    });

    it('posts a balanced journal for a tax-exclusive bill', async () => {
      const billId = await createBill({
        entries: [
          {
            index: 1,
            itemId,
            quantity: 2,
            rate: 1000,
            taxRateId: taxRate10,
            description: 'Item description...',
          },
        ],
      });

      const legs = await fetchLegs('Bill', billId);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '20001', contactId: vendorId, credit: 2000 },
          { accountCode: '40002', debit: 2000 },
          { accountCode: '20006', debit: 200 },
          { accountCode: '40009', credit: 200 },
        ],
        'Bill',
      );
    });

    it('posts a balanced journal for a tax-inclusive bill', async () => {
      const billId = await createBill({
        isInclusiveTax: true,
        entries: [
          {
            index: 1,
            itemId,
            quantity: 2,
            rate: 1000,
            taxRateId: taxRate10,
            description: 'Item description...',
          },
        ],
      });

      const legs = await fetchLegs('Bill', billId);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '20001', contactId: vendorId, credit: 1800 },
          { accountCode: '40002', debit: 1818.18 },
          { accountCode: '20006', debit: 181.82 },
          { accountCode: '40009', credit: 200 },
        ],
        'Bill',
      );
    });

    it('posts a balanced journal for a bill with adjustment', async () => {
      const billId = await createBill({
        adjustment: 50,
      });

      const legs = await fetchLegs('Bill', billId);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '20001', contactId: vendorId, credit: 1850 },
          { accountCode: '40002', debit: 2000 },
          { accountCode: '40009', credit: 200 },
          { accountCode: '40011', debit: 50 },
        ],
        'Bill',
      );
    });

    it('posts a balanced journal for a multi-currency tax-exclusive bill', async () => {
      const billId = await createBill({
        vendorId: foreignVendorId,
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

      const legs = await fetchLegs('Bill', billId);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { contactId: foreignVendorId, credit: 1200 },
          { accountCode: '40002', debit: 1200 },
          { accountCode: '20006', debit: 120 },
          { accountCode: '40009', credit: 120 },
        ],
        'Bill',
      );
    });
  });

  describe('Bill Payment', () => {
    it('posts a balanced journal for a bill payment', async () => {
      const billRes = await request(app.getHttpServer())
        .post('/bills')
        .set(authHeaders())
        .send({
          vendorId,
          billDate: '2023-01-01',
          dueDate: '2023-02-01',
          billNumber: faker.string.alphanumeric(10),
          referenceNo: 'REF-000201',
          open: true,
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
        .post('/bill-payments')
        .set(authHeaders())
        .send({
          vendorId,
          paymentAccountId: 1000,
          paymentDate: '2023-01-01',
          paymentNumber: faker.string.alphanumeric(10),
          branchId: 1,
          entries: [{ billId: billRes.body.id, paymentAmount: 1000 }],
        })
        .expect(201);

      const legs = await fetchLegs('BillPayment', paymentRes.body.id);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '20001', contactId: vendorId, debit: 1000 },
          { accountCode: '10001', credit: 1000 },
        ],
        'BillPayment',
      );
    });
  });

  describe('Vendor Credit', () => {
    it('posts a balanced journal for an opened vendor credit with discount', async () => {
      const res = await request(app.getHttpServer())
        .post('/vendor-credits')
        .set(authHeaders())
        .send({
          vendorId,
          exchangeRate: 1,
          vendorCreditNumber: faker.string.uuid(),
          vendorCreditDate: '2025-01-01',
          open: true,
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
          branchId: 1,
          warehouseId: 1,
        })
        .expect(201);

      const legs = await fetchLegs('VendorCredit', res.body.id);

      expectBalanced(legs);
      expectLegs(
        legs,
        [
          { accountCode: '20001', contactId: vendorId, debit: 900 },
          { accountCode: '40002', credit: 1000 },
          { accountCode: '40009', debit: 100 },
        ],
        'VendorCredit',
      );
    });
  });
});
