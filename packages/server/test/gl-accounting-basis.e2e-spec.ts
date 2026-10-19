import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';
import {
  authHeaders,
  cancelTransactionsLock,
  createCustomer,
  createServiceItem,
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

  describe('Credit notes and refunds', () => {
    const BANK_ACCOUNT_CODE = '10001';

    const creditNoteDate = '2033-06-19';
    const refundDate = '2033-06-20';

    let bankAccountId: number;
    let baseline: {
      incomeAccrual: number;
      incomeCash: number;
      arAccrual: TrialBalanceRow;
      arCash: TrialBalanceRow;
    };

    const createCreditNote = async () => {
      const res = await request(app.getHttpServer())
        .post('/credit-notes')
        .set(authHeaders())
        .send({
          customerId,
          creditNoteDate,
          open: true,
          branchId: 1,
          warehouseId: 1,
          entries: [
            {
              index: 1,
              itemId,
              quantity: 1,
              rate: 1000,
              description: 'Accounting basis test credit note',
            },
          ],
        })
        .expect(201);

      return res.body.id;
    };

    const createRefund = async (creditNoteId: number) => {
      const res = await request(app.getHttpServer())
        .post(`/credit-notes/${creditNoteId}/refunds`)
        .set(authHeaders())
        .send({
          fromAccountId: bankAccountId,
          amount: 1000,
          exchangeRate: 1,
          referenceNo: faker.string.uuid(),
          description: 'Accounting basis test credit note refund',
          date: refundDate,
        })
        .expect(201);

      return res.body.id;
    };

    beforeAll(async () => {
      const accountsByCode = await fetchAccountsByCode();
      bankAccountId = accountsByCode[BANK_ACCOUNT_CODE].id;

      // Capture the baseline numbers before seeding the fixtures.
      baseline = {
        incomeAccrual: await fetchIncomeTotal('accrual'),
        incomeCash: await fetchIncomeTotal('cash'),
        arAccrual: await fetchTrialBalanceRow(arAccountId, 'accrual'),
        arCash: await fetchTrialBalanceRow(arAccountId, 'cash'),
      };
    });

    describe('Opened credit note', () => {
      beforeAll(async () => {
        await createCreditNote();
      });

      it('reduces the income on the accrual basis report', async () => {
        const incomeAccrual = await fetchIncomeTotal('accrual');
        expect(incomeAccrual - baseline.incomeAccrual).toBeCloseTo(-1000, 2);
      });

      it('does not reduce the income on the cash basis report', async () => {
        const incomeCash = await fetchIncomeTotal('cash');
        expect(incomeCash - baseline.incomeCash).toBeCloseTo(0, 2);
      });

      it('credits the receivable on the accrual basis trial balance', async () => {
        const arAccrual = await fetchTrialBalanceRow(arAccountId, 'accrual');
        expect(arAccrual.balance - baseline.arAccrual.balance).toBeCloseTo(
          -1000,
          2,
        );
      });

      it('has no receivable on the cash basis trial balance', async () => {
        const arCash = await fetchTrialBalanceRow(arAccountId, 'cash');
        expect(arCash.balance - baseline.arCash.balance).toBeCloseTo(0, 2);
      });
    });

    describe('Credit note refund', () => {
      let refundBaseline: {
        incomeAccrual: number;
        incomeCash: number;
        arAccrual: TrialBalanceRow;
        arCash: TrialBalanceRow;
        bankAccrual: TrialBalanceRow;
        bankCash: TrialBalanceRow;
      };

      beforeAll(async () => {
        // Capture the baseline after the previous credit note fixture.
        refundBaseline = {
          incomeAccrual: await fetchIncomeTotal('accrual'),
          incomeCash: await fetchIncomeTotal('cash'),
          arAccrual: await fetchTrialBalanceRow(arAccountId, 'accrual'),
          arCash: await fetchTrialBalanceRow(arAccountId, 'cash'),
          bankAccrual: await fetchTrialBalanceRow(bankAccountId, 'accrual'),
          bankCash: await fetchTrialBalanceRow(bankAccountId, 'cash'),
        };

        const creditNoteId = await createCreditNote();
        await createRefund(creditNoteId);
      });

      it('does not double reduce the income on the accrual basis report', async () => {
        const incomeAccrual = await fetchIncomeTotal('accrual');
        expect(incomeAccrual - refundBaseline.incomeAccrual).toBeCloseTo(
          -1000,
          2,
        );
      });

      it('reverses the income on the cash basis report', async () => {
        const incomeCash = await fetchIncomeTotal('cash');
        expect(incomeCash - refundBaseline.incomeCash).toBeCloseTo(-1000, 2);
      });

      it('settles the receivable back on the accrual basis trial balance', async () => {
        const arAccrual = await fetchTrialBalanceRow(arAccountId, 'accrual');
        expect(
          arAccrual.balance - refundBaseline.arAccrual.balance,
        ).toBeCloseTo(0, 2);
      });

      it('keeps no receivable on the cash basis trial balance', async () => {
        const arCash = await fetchTrialBalanceRow(arAccountId, 'cash');
        expect(arCash.balance - refundBaseline.arCash.balance).toBeCloseTo(
          0,
          2,
        );
      });

      it('posts the cash outflow once on both bases', async () => {
        const bankAccrual = await fetchTrialBalanceRow(
          bankAccountId,
          'accrual',
        );
        const bankCash = await fetchTrialBalanceRow(bankAccountId, 'cash');

        expect(
          bankAccrual.balance - refundBaseline.bankAccrual.balance,
        ).toBeCloseTo(-1000, 2);
        expect(bankCash.balance - refundBaseline.bankCash.balance).toBeCloseTo(
          -1000,
          2,
        );
      });
    });
  });
});
