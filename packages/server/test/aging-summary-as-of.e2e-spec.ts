import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';
import {
  authHeaders,
  cancelTransactionsLock,
  createCustomer,
  createVendor,
  getBaseCurrency,
} from './_utils/gl';

/**
 * E2E assertions of the A/R and A/P aging summaries as of a past date.
 *
 * Every report is filtered by the contacts created here, so other data in the
 * shared tenant database doesn't change the totals. All dates are fixed.
 */
describe('Aging summaries as of the report date (e2e)', () => {
  let itemId: number;

  let mainCustomerId: number;
  let adjustmentCustomerId: number;
  let creditCustomerId: number;
  let mainVendorId: number;
  let noDueVendorId: number;
  let creditVendorId: number;

  const unique = () => faker.string.alphanumeric({ length: 10 });

  /**
   * Creates a service item that can be sold and bought. It sends a `unit`
   * so the test doesn't depend on whether the field is optional.
   */
  const createItem = async (): Promise<number> => {
    const res = await request(app.getHttpServer())
      .post('/items')
      .set(authHeaders())
      .send({
        name: `Aging Test Item ${unique()}`,
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

  const createInvoice = async (data: {
    customerId: number;
    invoiceDate: string;
    dueDate: string;
    rate: number;
    delivered?: boolean;
    adjustment?: number;
  }): Promise<number> => {
    const { rate, delivered = true, ...rest } = data;
    const res = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set(authHeaders())
      .send({
        ...rest,
        invoiceNo: unique(),
        delivered,
        entries: [{ index: 1, itemId, quantity: 1, rate }],
      })
      .expect(201);
    return res.body.id;
  };

  const receivePayment = (
    customerId: number,
    paymentDate: string,
    entries: Array<{ invoiceId: number; paymentAmount: number }>,
  ) =>
    request(app.getHttpServer())
      .post('/payments-received')
      .set(authHeaders())
      .send({
        customerId,
        paymentDate,
        exchangeRate: 1,
        depositAccountId: 1000,
        paymentReceiveNo: unique(),
        entries: entries.map((entry, index) => ({
          index: index + 1,
          ...entry,
        })),
      })
      .expect(201);

  const createBill = async (data: {
    vendorId: number;
    billDate: string;
    dueDate?: string;
    rate: number;
    open?: boolean;
  }): Promise<number> => {
    const { rate, open = true, ...rest } = data;
    const res = await request(app.getHttpServer())
      .post('/bills')
      .set(authHeaders())
      .send({
        ...rest,
        billNumber: unique(),
        open,
        entries: [{ index: 1, itemId, quantity: 1, rate }],
      })
      .expect(201);
    return res.body.id;
  };

  const payBills = (
    vendorId: number,
    paymentDate: string,
    entries: Array<{ billId: number; paymentAmount: number }>,
  ) =>
    request(app.getHttpServer())
      .post('/bill-payments')
      .set(authHeaders())
      .send({
        vendorId,
        paymentAccountId: 1000,
        paymentDate,
        paymentNumber: unique(),
        entries,
      })
      .expect(201);

  const createCreditNote = async (
    customerId: number,
    creditNoteDate: string,
    rate: number,
  ): Promise<number> => {
    const res = await request(app.getHttpServer())
      .post('/credit-notes')
      .set(authHeaders())
      .send({
        customerId,
        creditNoteDate,
        creditNoteNumber: unique(),
        open: true,
        entries: [{ index: 1, itemId, quantity: 1, rate }],
      })
      .expect(201);
    return res.body.id;
  };

  const applyCreditNote = (
    creditNoteId: number,
    invoiceId: number,
    amount: number,
  ) =>
    request(app.getHttpServer())
      .post(`/credit-notes/${creditNoteId}/apply-invoices`)
      .set(authHeaders())
      .send({ entries: [{ invoiceId, amount }] })
      .expect(201);

  const createVendorCredit = async (
    vendorId: number,
    vendorCreditDate: string,
    rate: number,
  ): Promise<number> => {
    const res = await request(app.getHttpServer())
      .post('/vendor-credits')
      .set(authHeaders())
      .send({
        vendorId,
        exchangeRate: 1,
        vendorCreditNumber: unique(),
        vendorCreditDate,
        open: true,
        entries: [{ index: 1, itemId, quantity: 1, rate }],
      })
      .expect(201);
    return res.body.id;
  };

  const applyVendorCredit = (
    vendorCreditId: number,
    billId: number,
    amount: number,
  ) =>
    request(app.getHttpServer())
      .post(`/vendor-credits/${vendorCreditId}/apply-to-bills`)
      .set(authHeaders())
      .send({ entries: [{ billId, amount }] })
      .expect(201);

  /**
   * Fetches the aging row of one contact. The report serializes keys to
   * snake_case; the amounts used here are `current`, `aging[i].total` and
   * `total`.
   */
  const aging = async (
    kind: 'customer' | 'vendor',
    asDate: string,
    contactId: number,
    extraQuery = '',
  ) => {
    const path =
      kind === 'customer'
        ? `/reports/receivable-aging-summary?asDate=${asDate}&customersIds[0]=${contactId}${extraQuery}`
        : `/reports/payable-aging-summary?asDate=${asDate}&vendorsIds[0]=${contactId}${extraQuery}`;
    const res = await request(app.getHttpServer())
      .get(path)
      .set(authHeaders())
      .set('Accept', 'application/json')
      .expect(200);
    const rows =
      kind === 'customer' ? res.body.data.customers : res.body.data.vendors;
    const row = rows[0];

    return {
      current: row ? row.current.amount : 0,
      aging: row ? row.aging.map((period) => period.total.amount) : [0, 0, 0],
      total: row ? row.total.amount : 0,
    };
  };

  /**
   * Fetches the ledger-based balance of one contact on the given date.
   */
  const balance = async (
    kind: 'customer' | 'vendor',
    asDate: string,
    contactId: number,
  ): Promise<number> => {
    const path =
      kind === 'customer'
        ? `/reports/customer-balance-summary?asDate=${asDate}&customersIds[0]=${contactId}`
        : `/reports/vendor-balance-summary?asDate=${asDate}&vendorsIds[0]=${contactId}`;
    const res = await request(app.getHttpServer())
      .get(path)
      .set(authHeaders())
      .set('Accept', 'application/json')
      .expect(200);
    const rows =
      kind === 'customer' ? res.body.data.customers : res.body.data.vendors;

    return rows[0] ? rows[0].total.amount : 0;
  };

  beforeAll(async () => {
    await cancelTransactionsLock();
    const currencyCode = await getBaseCurrency();
    itemId = await createItem();

    // Main customer: invoices A, B, C, a draft E and an invoice F dated
    // after the as-of date; A and B are paid (in part) after it.
    mainCustomerId = await createCustomer(currencyCode);
    const invoiceA = await createInvoice({
      customerId: mainCustomerId,
      invoiceDate: '2025-12-01',
      dueDate: '2025-12-31',
      rate: 1000,
    });
    const invoiceB = await createInvoice({
      customerId: mainCustomerId,
      invoiceDate: '2025-12-01',
      dueDate: '2025-12-31',
      rate: 500,
    });
    await createInvoice({
      customerId: mainCustomerId,
      invoiceDate: '2025-12-01',
      dueDate: '2025-12-15',
      rate: 250,
    });
    await createInvoice({
      customerId: mainCustomerId,
      invoiceDate: '2025-12-05',
      dueDate: '2025-12-31',
      rate: 70,
      delivered: false,
    });
    await createInvoice({
      customerId: mainCustomerId,
      invoiceDate: '2026-01-05',
      dueDate: '2026-02-04',
      rate: 999,
    });
    await receivePayment(mainCustomerId, '2026-01-15', [
      { invoiceId: invoiceA, paymentAmount: 1000 },
      { invoiceId: invoiceB, paymentAmount: 200 },
    ]);

    // Adjustment customer: a total of 120 (100 + 20 adjustment), 100 paid.
    adjustmentCustomerId = await createCustomer(currencyCode);
    const adjustedInvoice = await createInvoice({
      customerId: adjustmentCustomerId,
      invoiceDate: '2025-12-01',
      dueDate: '2025-12-31',
      rate: 100,
      adjustment: 20,
    });
    await receivePayment(adjustmentCustomerId, '2025-12-20', [
      { invoiceId: adjustedInvoice, paymentAmount: 100 },
    ]);

    // Credit customer: invoice G with a credit note dated before the as-of
    // date and one dated after it, both applied.
    creditCustomerId = await createCustomer(currencyCode);
    const invoiceG = await createInvoice({
      customerId: creditCustomerId,
      invoiceDate: '2025-12-01',
      dueDate: '2025-12-31',
      rate: 600,
    });
    const earlyCreditNote = await createCreditNote(
      creditCustomerId,
      '2025-12-10',
      200,
    );
    await applyCreditNote(earlyCreditNote, invoiceG, 200);
    const lateCreditNote = await createCreditNote(
      creditCustomerId,
      '2026-01-10',
      100,
    );
    await applyCreditNote(lateCreditNote, invoiceG, 100);

    // Main vendor: a bill paid in part after the as-of date and a draft bill.
    mainVendorId = await createVendor(currencyCode);
    const mainBill = await createBill({
      vendorId: mainVendorId,
      billDate: '2025-12-01',
      dueDate: '2025-12-31',
      rate: 800,
    });
    await createBill({
      vendorId: mainVendorId,
      billDate: '2025-12-05',
      dueDate: '2025-12-31',
      rate: 40,
      open: false,
    });
    await payBills(mainVendorId, '2026-01-15', [
      { billId: mainBill, paymentAmount: 300 },
    ]);

    // No-due vendor: a bill without a due date.
    noDueVendorId = await createVendor(currencyCode);
    await createBill({
      vendorId: noDueVendorId,
      billDate: '2025-12-01',
      rate: 90,
    });

    // Credit vendor: bill H with a vendor credit dated before the as-of date
    // and one dated after it, both applied.
    creditVendorId = await createVendor(currencyCode);
    const billH = await createBill({
      vendorId: creditVendorId,
      billDate: '2025-12-01',
      dueDate: '2025-12-31',
      rate: 500,
    });
    const earlyVendorCredit = await createVendorCredit(
      creditVendorId,
      '2025-12-10',
      150,
    );
    await applyVendorCredit(earlyVendorCredit, billH, 150);
    const lateVendorCredit = await createVendorCredit(
      creditVendorId,
      '2026-01-10',
      50,
    );
    await applyVendorCredit(lateVendorCredit, billH, 50);
  });

  it('A/R as of 2025-12-31 counts what was open that day and leaves out drafts and later invoices', async () => {
    const row = await aging('customer', '2025-12-31', mainCustomerId);

    expect(row.current).toBe(1500);
    expect(row.aging).toEqual([250, 0, 0]);
    expect(row.total).toBe(1750);
  });

  it('A/R aging ties to the customer balance summary', async () => {
    for (const [customerId, expected] of [
      [mainCustomerId, 1750],
      [adjustmentCustomerId, 20],
      [creditCustomerId, 400],
    ]) {
      const row = await aging('customer', '2025-12-31', customerId);
      expect(row.total).toBe(expected);
      expect(await balance('customer', '2025-12-31', customerId)).toBe(
        expected,
      );
    }
  });

  it('A/R as of 2026-01-31 ages from that date', async () => {
    const row = await aging('customer', '2026-01-31', mainCustomerId);

    expect(row.current).toBe(999);
    expect(row.aging).toEqual([0, 550, 0]);
    expect(row.total).toBe(1549);
  });

  it('A/R uses the real total, not the line subtotal', async () => {
    const row = await aging('customer', '2025-12-31', adjustmentCustomerId);

    expect(row.current).toBe(20);
  });

  it('A/R counts credit notes from their own date', async () => {
    const row = await aging('customer', '2025-12-31', creditCustomerId);

    expect(row.current).toBe(400);
  });

  it('A/R keeps the branch filter', async () => {
    const row = await aging(
      'customer',
      '2025-12-31',
      mainCustomerId,
      '&branchesIds[0]=999999',
    );

    expect(row.total).toBe(0);
  });

  it('A/P as of 2025-12-31 counts what was open that day and leaves out drafts', async () => {
    const row = await aging('vendor', '2025-12-31', mainVendorId);

    expect(row.current).toBe(800);
    expect(row.total).toBe(800);
    expect(await balance('vendor', '2025-12-31', mainVendorId)).toBe(800);
  });

  it('A/P ages a bill with no due date from its bill date', async () => {
    const row = await aging('vendor', '2025-12-31', noDueVendorId);

    expect(row.aging[0]).toBe(90);
    expect(row.total).toBe(90);
    expect(await balance('vendor', '2025-12-31', noDueVendorId)).toBe(90);
  });

  it('A/P counts vendor credits from their own date', async () => {
    const row = await aging('vendor', '2025-12-31', creditVendorId);

    expect(row.current).toBe(350);
    expect(await balance('vendor', '2025-12-31', creditVendorId)).toBe(350);
  });
});
