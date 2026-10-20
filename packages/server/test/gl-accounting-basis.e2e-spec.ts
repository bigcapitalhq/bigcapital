import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';
import {
  authHeaders,
  cancelTransactionsLock,
  createCustomer,
  createServiceItem,
  createVendor,
  getBaseCurrency,
} from './_utils/gl';
import {
  collectAccountNodes,
  fetchAccountsByCode,
} from './_utils/balance-sheet';

interface TrialBalanceRow {
  id: number;
  debit: number;
  credit: number;
  balance: number;
}

/**
 * E2E assertions of the cash vs accrual accounting basis reports.
 *
 * Fixtures are seeded on unique far-future dates so the report totals of the
 * shared tenant database only contain the transactions created here.
 */
describe('Accounting basis — cash vs accrual reports (e2e)', () => {
  const range = { fromDate: '2033-06-01', toDate: '2033-06-30' };
  const invoiceDate = '2033-06-15';
  const paymentDate = '2033-06-16';

  const INCOME_ACCOUNT_CODE = '50002';
  const AR_ACCOUNT_CODE = '10007';

  let customerId: number;
  let itemId: number;
  let incomeAccountId: number;
  let arAccountId: number;

  let baseline: {
    incomeAccrual: number;
    incomeCash: number;
    arAccrual: TrialBalanceRow;
    arCash: TrialBalanceRow;
  };

  /**
   * Fetches the profit & loss income total of the tested account.
   */
  const fetchIncomeTotal = async (basis: 'cash' | 'accrual') => {
    const res = await request(app.getHttpServer())
      .get('/reports/profit-loss-sheet')
      .query({ ...range, basis })
      .set(authHeaders())
      .expect(200);

    const node = collectAccountNodes(res.body.data).find(
      (n) => Number(n.id) === incomeAccountId,
    );
    return node ? Number(node.total.amount) : 0;
  };

  /**
   * Deeply searches the trial balance account nodes by account id.
   */
  const findAccountRow = (nodes: any[], accountId: number): any | undefined => {
    for (const node of nodes ?? []) {
      if (Number(node.id) === accountId) return node;
      const found = findAccountRow(node.children ?? [], accountId);
      if (found) return found;
    }
    return undefined;
  };

  /**
   * Fetches the trial balance row of the tested account.
   */
  const fetchTrialBalanceRow = async (
    accountId: number,
    basis: 'cash' | 'accrual',
  ): Promise<TrialBalanceRow> => {
    const res = await request(app.getHttpServer())
      .get('/reports/trial-balance-sheet')
      .query({ ...range, basis })
      .set(authHeaders())
      .expect(200);

    const row = findAccountRow(res.body.data.accounts ?? [], accountId);
    return {
      id: accountId,
      debit: Number(row?.debit ?? 0),
      credit: Number(row?.credit ?? 0),
      balance: Number(row?.balance ?? 0),
    };
  };

  const createInvoice = async () => {
    const res = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set(authHeaders())
      .send({
        customerId,
        invoiceDate,
        dueDate: invoiceDate,
        invoiceNo: faker.string.uuid(),
        referenceNo: `BASIS-${faker.string.alphanumeric({ length: 6 })}`,
        delivered: true,
        branchId: 1,
        warehouseId: 1,
        entries: [
          {
            index: 1,
            itemId,
            quantity: 1,
            rate: 1000,
            description: 'Accounting basis test item',
          },
        ],
      })
      .expect(201);

    return res.body.id;
  };

  const createPayment = async (invoiceId: number) => {
    const res = await request(app.getHttpServer())
      .post('/payments-received')
      .set(authHeaders())
      .send({
        customerId,
        paymentDate,
        exchangeRate: 1,
        referenceNo: faker.string.uuid(),
        depositAccountId: 1000,
        paymentReceiveNo: faker.string.uuid(),
        statement: 'Accounting basis test payment',
        entries: [{ index: 1, invoiceId, paymentAmount: 1000 }],
        branchId: 1,
      })
      .expect(201);

    return res.body.id;
  };

  beforeAll(async () => {
    await cancelTransactionsLock();

    const baseCurrency = await getBaseCurrency();
    customerId = await createCustomer(baseCurrency);
    itemId = await createServiceItem();

    const accountsByCode = await fetchAccountsByCode();
    incomeAccountId = accountsByCode[INCOME_ACCOUNT_CODE].id;
    arAccountId = accountsByCode[AR_ACCOUNT_CODE].id;

    // Capture the baseline numbers before seeding the fixtures.
    baseline = {
      incomeAccrual: await fetchIncomeTotal('accrual'),
      incomeCash: await fetchIncomeTotal('cash'),
      arAccrual: await fetchTrialBalanceRow(arAccountId, 'accrual'),
      arCash: await fetchTrialBalanceRow(arAccountId, 'cash'),
    };
  });

  describe('Delivered sale invoice', () => {
    beforeAll(async () => {
      await createInvoice();
    });

    it('recognizes the income on the accrual basis report', async () => {
      const incomeAccrual = await fetchIncomeTotal('accrual');
      expect(incomeAccrual - baseline.incomeAccrual).toBeCloseTo(1000, 2);
    });

    it('does not recognize the income on the cash basis report', async () => {
      const incomeCash = await fetchIncomeTotal('cash');
      expect(incomeCash - baseline.incomeCash).toBeCloseTo(0, 2);
    });

    it('posts the receivable on the accrual basis trial balance', async () => {
      const arAccrual = await fetchTrialBalanceRow(arAccountId, 'accrual');
      expect(arAccrual.balance - baseline.arAccrual.balance).toBeCloseTo(
        1000,
        2,
      );
    });

    it('has no receivable on the cash basis trial balance', async () => {
      const arCash = await fetchTrialBalanceRow(arAccountId, 'cash');
      expect(arCash.balance - baseline.arCash.balance).toBeCloseTo(0, 2);
    });
  });

  describe('Payment received', () => {
    let invoiceId: number;
    let paymentBaseline: {
      incomeAccrual: number;
      incomeCash: number;
      arAccrual: TrialBalanceRow;
      arCash: TrialBalanceRow;
    };

    beforeAll(async () => {
      // Capture the baseline after the previous invoice fixture.
      paymentBaseline = {
        incomeAccrual: await fetchIncomeTotal('accrual'),
        incomeCash: await fetchIncomeTotal('cash'),
        arAccrual: await fetchTrialBalanceRow(arAccountId, 'accrual'),
        arCash: await fetchTrialBalanceRow(arAccountId, 'cash'),
      };

      invoiceId = await createInvoice();
      await createPayment(invoiceId);
    });

    it('does not double count the income on the accrual basis report', async () => {
      const incomeAccrual = await fetchIncomeTotal('accrual');
      expect(incomeAccrual - paymentBaseline.incomeAccrual).toBeCloseTo(
        1000,
        2,
      );
    });

    it('recognizes the income once on the cash basis report', async () => {
      const incomeCash = await fetchIncomeTotal('cash');
      expect(incomeCash - paymentBaseline.incomeCash).toBeCloseTo(1000, 2);
    });

    it('settles the receivable on the accrual basis trial balance', async () => {
      const arAccrual = await fetchTrialBalanceRow(arAccountId, 'accrual');
      expect(arAccrual.balance - paymentBaseline.arAccrual.balance).toBeCloseTo(
        0,
        2,
      );
    });

    it('keeps no receivable on the cash basis trial balance', async () => {
      const arCash = await fetchTrialBalanceRow(arAccountId, 'cash');
      expect(arCash.balance - paymentBaseline.arCash.balance).toBeCloseTo(0, 2);
    });
  });

  describe('Bills and bill payments', () => {
    const EXPENSE_ACCOUNT_CODE = '40002';
    const AP_ACCOUNT_CODE = '20001';
    const PAYMENT_ACCOUNT_CODE = '10001';

    const billDate = '2033-06-17';
    const billPaymentDate = '2033-06-18';

    let vendorId: number;
    let expenseAccountId: number;
    let apAccountId: number;
    let paymentAccountId: number;

    let baseline: {
      expenseAccrual: number;
      expenseCash: number;
      apAccrual: TrialBalanceRow;
      apCash: TrialBalanceRow;
    };

    /**
     * Fetches the profit & loss expense total of the tested account.
     */
    const fetchExpenseTotal = async (basis: 'cash' | 'accrual') => {
      const res = await request(app.getHttpServer())
        .get('/reports/profit-loss-sheet')
        .query({ ...range, basis })
        .set(authHeaders())
        .expect(200);

      const node = collectAccountNodes(res.body.data).find(
        (n) => Number(n.id) === expenseAccountId,
      );
      return node ? Number(node.total.amount) : 0;
    };

    const createBill = async () => {
      const res = await request(app.getHttpServer())
        .post('/bills')
        .set(authHeaders())
        .send({
          vendorId,
          billDate,
          dueDate: billDate,
          billNumber: faker.string.uuid(),
          referenceNo: `BASIS-${faker.string.alphanumeric({ length: 6 })}`,
          open: true,
          branchId: 1,
          warehouseId: 1,
          entries: [
            {
              index: 1,
              itemId,
              quantity: 1,
              rate: 1000,
              description: 'Accounting basis test purchase',
            },
          ],
        })
        .expect(201);

      return res.body.id;
    };

    const createBillPayment = async (billId: number) => {
      const res = await request(app.getHttpServer())
        .post('/bill-payments')
        .set(authHeaders())
        .send({
          vendorId,
          paymentDate: billPaymentDate,
          exchangeRate: 1,
          reference: faker.string.uuid(),
          paymentAccountId,
          paymentNumber: faker.string.uuid(),
          statement: 'Accounting basis test purchase payment',
          entries: [{ index: 1, billId, paymentAmount: 1000 }],
          branchId: 1,
        })
        .expect(201);

      return res.body.id;
    };

    beforeAll(async () => {
      const baseCurrency = await getBaseCurrency();
      vendorId = await createVendor(baseCurrency);

      const accountsByCode = await fetchAccountsByCode();
      expenseAccountId = accountsByCode[EXPENSE_ACCOUNT_CODE].id;
      apAccountId = accountsByCode[AP_ACCOUNT_CODE].id;
      paymentAccountId = accountsByCode[PAYMENT_ACCOUNT_CODE].id;

      // Capture the baseline numbers before seeding the fixtures.
      baseline = {
        expenseAccrual: await fetchExpenseTotal('accrual'),
        expenseCash: await fetchExpenseTotal('cash'),
        apAccrual: await fetchTrialBalanceRow(apAccountId, 'accrual'),
        apCash: await fetchTrialBalanceRow(apAccountId, 'cash'),
      };
    });

    describe('Opened bill', () => {
      beforeAll(async () => {
        await createBill();
      });

      it('recognizes the purchase expense on the accrual basis report', async () => {
        const expenseAccrual = await fetchExpenseTotal('accrual');
        expect(expenseAccrual - baseline.expenseAccrual).toBeCloseTo(1000, 2);
      });

      it('does not recognize the purchase expense on the cash basis report', async () => {
        const expenseCash = await fetchExpenseTotal('cash');
        expect(expenseCash - baseline.expenseCash).toBeCloseTo(0, 2);
      });

      it('posts the payable on the accrual basis trial balance', async () => {
        const apAccrual = await fetchTrialBalanceRow(apAccountId, 'accrual');
        // A payable is a credit balance (debit - credit), hence the negative.
        expect(apAccrual.balance - baseline.apAccrual.balance).toBeCloseTo(
          -1000,
          2,
        );
      });

      it('has no payable on the cash basis trial balance', async () => {
        const apCash = await fetchTrialBalanceRow(apAccountId, 'cash');
        expect(apCash.balance - baseline.apCash.balance).toBeCloseTo(0, 2);
      });
    });

    describe('Bill payment', () => {
      let paymentBaseline: {
        expenseAccrual: number;
        expenseCash: number;
        apAccrual: TrialBalanceRow;
        apCash: TrialBalanceRow;
        bankAccrual: TrialBalanceRow;
        bankCash: TrialBalanceRow;
      };

      beforeAll(async () => {
        // Capture the baseline after the previous bill fixture.
        paymentBaseline = {
          expenseAccrual: await fetchExpenseTotal('accrual'),
          expenseCash: await fetchExpenseTotal('cash'),
          apAccrual: await fetchTrialBalanceRow(apAccountId, 'accrual'),
          apCash: await fetchTrialBalanceRow(apAccountId, 'cash'),
          bankAccrual: await fetchTrialBalanceRow(paymentAccountId, 'accrual'),
          bankCash: await fetchTrialBalanceRow(paymentAccountId, 'cash'),
        };

        const billId = await createBill();
        await createBillPayment(billId);
      });

      it('does not double count the purchase expense on the accrual basis report', async () => {
        const expenseAccrual = await fetchExpenseTotal('accrual');
        expect(expenseAccrual - paymentBaseline.expenseAccrual).toBeCloseTo(
          1000,
          2,
        );
      });

      it('recognizes the purchase expense on the cash basis report', async () => {
        const expenseCash = await fetchExpenseTotal('cash');
        expect(expenseCash - paymentBaseline.expenseCash).toBeCloseTo(1000, 2);
      });

      it('settles the payable on the accrual basis trial balance', async () => {
        const apAccrual = await fetchTrialBalanceRow(apAccountId, 'accrual');
        expect(
          apAccrual.balance - paymentBaseline.apAccrual.balance,
        ).toBeCloseTo(0, 2);
      });

      it('keeps no payable on the cash basis trial balance', async () => {
        const apCash = await fetchTrialBalanceRow(apAccountId, 'cash');
        expect(apCash.balance - paymentBaseline.apCash.balance).toBeCloseTo(
          0,
          2,
        );
      });

      it('posts the cash outflow once on both bases', async () => {
        const bankAccrual = await fetchTrialBalanceRow(
          paymentAccountId,
          'accrual',
        );
        const bankCash = await fetchTrialBalanceRow(paymentAccountId, 'cash');

        expect(
          paymentBaseline.bankAccrual.balance - bankAccrual.balance,
        ).toBeCloseTo(1000, 2);
        expect(paymentBaseline.bankCash.balance - bankCash.balance).toBeCloseTo(
          1000,
          2,
        );
      });
    });
  });
});
