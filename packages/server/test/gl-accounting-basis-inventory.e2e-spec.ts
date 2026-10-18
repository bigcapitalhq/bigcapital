import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';
import {
  authHeaders,
  cancelTransactionsLock,
  createCustomer,
  createVendor,
  expectBalanced,
  fetchLegs,
  getBaseCurrency,
} from './_utils/gl';
import {
  collectAccountNodes,
  fetchAccountsByCode,
} from './_utils/balance-sheet';

const RANGE = { fromDate: '2034-02-01', toDate: '2034-02-28' };
const BILL_DATE = '2034-01-10';
const ITEM_COST_DATE = '2034-01-11';
const INVOICE_DATE = '2034-02-10';
const PAYMENT_DATE = '2034-02-15';

const COST_AMOUNT = 600;
const INVOICE_AMOUNT = 1000;
const PAYMENT_AMOUNT = 400;
const EDITED_PAYMENT_AMOUNT = 600;

const COGS_ACCOUNT_CODE = '40002';
const INVENTORY_ASSET_ACCOUNT_CODE = '10008';
const INCOME_ACCOUNT_CODE = '50002';

/**
 * E2E assertions of the cash basis inventory cost (COGS) entries.
 *
 * The fixture seeds a purchase (bill) to establish the item cost, then a sale
 * invoice and a partial payment received before the asynchronous inventory
 * cost computation completes. The cost journal is asserted through the
 * transactions-by-reference report and the profit & loss statement.
 */
describe('Accounting basis — inventory cost (e2e)', () => {
  let customerId: number;
  let vendorId: number;
  let itemId: number;
  let incomeAccountId: number;
  let cogsAccountId: number;
  let inventoryAccountId: number;
  let invoiceId: number;
  let paymentId: number;
  let paymentReceiveNo: string;
  let baseline: {
    accrual: { income: number; cost: number };
    cash: { income: number; cost: number };
  };

  /**
   * Fetches the profit & loss income and cost totals of the fixture accounts.
   */
  const fetchProfitLossTotals = async (basis: 'cash' | 'accrual') => {
    const res = await request(app.getHttpServer())
      .get('/reports/profit-loss-sheet')
      .query({ ...RANGE, basis })
      .set(authHeaders())
      .expect(200);

    const nodes = collectAccountNodes(res.body.data);
    const accountTotal = (accountId: number) => {
      const node = nodes.find((n) => Number(n.id) === accountId);
      return node ? Number(node.total.amount) : 0;
    };
    return {
      income: accountTotal(incomeAccountId),
      cost: accountTotal(cogsAccountId),
    };
  };

  /**
   * Waits until the asynchronous inventory cost computation writes the cost
   * journal entries of the invoice and the payment.
   */
  const waitForCostEntries = async (timeoutMs = 90_000) => {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const [invoiceLegs, paymentLegs] = await Promise.all([
        fetchLegs('SaleInvoice', invoiceId),
        fetchLegs('PaymentReceive', paymentId),
      ]);
      const invoiceCostLeg = invoiceLegs.find(
        (leg) => leg.accountId === cogsAccountId,
      );
      const paymentCostLeg = paymentLegs.find(
        (leg) => leg.accountId === cogsAccountId,
      );
      if (invoiceCostLeg && paymentCostLeg) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 3_000));
    }
    throw new Error('Timed out waiting for the inventory cost GL entries.');
  };

  /**
   * Waits until the asynchronous inventory cost computation stores the
   * purchase cost lot of the item.
   */
  const waitForItemCost = async (timeoutMs = 90_000) => {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const res = await request(app.getHttpServer())
        .get('/inventory-cost/items')
        .query({ itemsIds: [itemId], date: ITEM_COST_DATE })
        .set(authHeaders())
        .expect(200);

      const itemCost = (res.body.costs || [])[0];
      if (
        itemCost &&
        Number(itemCost.quantity) >= 1 &&
        Number(itemCost.average) > 0
      ) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 3_000));
    }
    throw new Error('Timed out waiting for the item cost computation.');
  };

  beforeAll(async () => {
    await cancelTransactionsLock();

    const baseCurrency = await getBaseCurrency();
    customerId = await createCustomer(baseCurrency);
    vendorId = await createVendor(baseCurrency);

    const accountsByCode = await fetchAccountsByCode();
    incomeAccountId = accountsByCode[INCOME_ACCOUNT_CODE].id;
    cogsAccountId = accountsByCode[COGS_ACCOUNT_CODE].id;
    inventoryAccountId = accountsByCode[INVENTORY_ASSET_ACCOUNT_CODE].id;

    // Captures the report baseline before seeding the fixtures to keep the
    // assertions independent of any data other spec runs persisted.
    baseline = {
      accrual: await fetchProfitLossTotals('accrual'),
      cash: await fetchProfitLossTotals('cash'),
    };

    // Creates an inventory item with the cost/inventory accounts.
    const itemRes = await request(app.getHttpServer())
      .post('/items')
      .set(authHeaders())
      .send({
        name: `GL Inv Item ${faker.string.alphanumeric({ length: 6 })}`,
        type: 'inventory',
        sellable: true,
        purchasable: true,
        sellAccountId: incomeAccountId,
        costAccountId: cogsAccountId,
        inventoryAccountId,
        costPrice: COST_AMOUNT,
        sellPrice: INVOICE_AMOUNT,
      })
      .expect(201);
    itemId = parseInt(itemRes.body.id, 10);

    // Purchases one unit to establish the item cost.
    await request(app.getHttpServer())
      .post('/bills')
      .set(authHeaders())
      .send({
        vendorId,
        billDate: BILL_DATE,
        dueDate: BILL_DATE,
        billNumber: faker.string.uuid(),
        referenceNo: `BASIS-COST-${faker.string.alphanumeric({ length: 6 })}`,
        open: true,
        branchId: 1,
        warehouseId: 1,
        entries: [
          {
            index: 1,
            itemId,
            quantity: 1,
            rate: COST_AMOUNT,
            description: 'Accounting basis cost purchase',
          },
        ],
      })
      .expect(201);

    // Waits for the purchase cost lot to be computed before selling the item,
    // otherwise the invoice cost compute job supersedes the bill one.
    await waitForItemCost();

    // Sells one unit.
    const invoiceRes = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set(authHeaders())
      .send({
        customerId,
        invoiceDate: INVOICE_DATE,
        dueDate: INVOICE_DATE,
        invoiceNo: faker.string.uuid(),
        referenceNo: `BASIS-COST-${faker.string.alphanumeric({ length: 6 })}`,
        delivered: true,
        branchId: 1,
        warehouseId: 1,
        entries: [
          {
            index: 1,
            itemId,
            quantity: 1,
            rate: INVOICE_AMOUNT,
            description: 'Accounting basis cost sale',
          },
        ],
      })
      .expect(201);
    invoiceId = invoiceRes.body.id;

    // Partial payment received before the cost computation completes.
    paymentReceiveNo = faker.string.uuid();
    const paymentRes = await request(app.getHttpServer())
      .post('/payments-received')
      .set(authHeaders())
      .send({
        customerId,
        paymentDate: PAYMENT_DATE,
        exchangeRate: 1,
        referenceNo: faker.string.uuid(),
        depositAccountId: 1000,
        paymentReceiveNo,
        statement: 'Accounting basis cost payment',
        entries: [{ index: 1, invoiceId, paymentAmount: PAYMENT_AMOUNT }],
        branchId: 1,
      })
      .expect(201);
    paymentId = paymentRes.body.id;

    // Waits for the asynchronous cost computation to write the entries.
    await waitForCostEntries();
  });

  it('posts the full cost on the invoice cost journal (accrual basis)', async () => {
    const legs = await fetchLegs('SaleInvoice', invoiceId);

    expectBalanced(legs);

    const costLeg = legs.find((leg) => leg.accountId === cogsAccountId);
    expect(costLeg).toBeDefined();
    expect(costLeg.debit.amount).toBeCloseTo(COST_AMOUNT, 2);
    expect(costLeg.basis).toBe('accrual');

    const inventoryLeg = legs.find(
      (leg) => leg.accountId === inventoryAccountId,
    );
    expect(inventoryLeg).toBeDefined();
    expect(inventoryLeg.credit.amount).toBeCloseTo(COST_AMOUNT, 2);
    expect(inventoryLeg.basis).toBe('accrual');
  });

  it('posts the pro-rata cost on the payment journal (cash basis)', async () => {
    const legs = await fetchLegs('PaymentReceive', paymentId);
    const expectedCost = COST_AMOUNT * (PAYMENT_AMOUNT / INVOICE_AMOUNT);

    const costLeg = legs.find((leg) => leg.accountId === cogsAccountId);
    expect(costLeg).toBeDefined();
    expect(costLeg.debit.amount).toBeCloseTo(expectedCost, 2);
    expect(costLeg.basis).toBe('cash');

    const inventoryLeg = legs.find(
      (leg) => leg.accountId === inventoryAccountId,
    );
    expect(inventoryLeg).toBeDefined();
    expect(inventoryLeg.credit.amount).toBeCloseTo(expectedCost, 2);
    expect(inventoryLeg.basis).toBe('cash');
  });

  it('recognizes the full cost on the accrual basis profit & loss', async () => {
    const totals = await fetchProfitLossTotals('accrual');
    expect(totals.cost - baseline.accrual.cost).toBeCloseTo(COST_AMOUNT, 2);
    expect(totals.income - baseline.accrual.income).toBeCloseTo(
      INVOICE_AMOUNT,
      2,
    );
  });

  it('recognizes the pro-rata cost on the cash basis profit & loss', async () => {
    const totals = await fetchProfitLossTotals('cash');
    expect(totals.cost - baseline.cash.cost).toBeCloseTo(
      COST_AMOUNT * (PAYMENT_AMOUNT / INVOICE_AMOUNT),
      2,
    );
    expect(totals.income - baseline.cash.income).toBeCloseTo(PAYMENT_AMOUNT, 2);
  });

  it('rewrites the cash cost entries once the payment is edited', async () => {
    await request(app.getHttpServer())
      .put(`/payments-received/${paymentId}`)
      .set(authHeaders())
      .send({
        customerId,
        paymentDate: PAYMENT_DATE,
        exchangeRate: 1,
        referenceNo: faker.string.uuid(),
        depositAccountId: 1000,
        paymentReceiveNo,
        statement: 'Accounting basis cost payment edited',
        entries: [
          { index: 1, invoiceId, paymentAmount: EDITED_PAYMENT_AMOUNT },
        ],
        branchId: 1,
      })
      .expect(200);

    const legs = await fetchLegs('PaymentReceive', paymentId);
    const expectedCost = COST_AMOUNT * (EDITED_PAYMENT_AMOUNT / INVOICE_AMOUNT);

    const costLeg = legs.find((leg) => leg.accountId === cogsAccountId);
    expect(costLeg).toBeDefined();
    expect(costLeg.debit.amount).toBeCloseTo(expectedCost, 2);
    expect(costLeg.basis).toBe('cash');

    const totals = await fetchProfitLossTotals('cash');
    expect(totals.cost - baseline.cash.cost).toBeCloseTo(expectedCost, 2);
  });
});
