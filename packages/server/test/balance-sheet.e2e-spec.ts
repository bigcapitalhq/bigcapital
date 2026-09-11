import request = require('supertest');
import { app } from './init-app-test';
import {
  authHeaders,
  cancelTransactionsLock,
  createCustomer,
  createVendor,
  getBaseCurrency,
} from './_utils/gl';
import {
  AccountsByCode,
  BSNode,
  accountTotalsMap,
  childrenTotalSum,
  collectAccountNodes,
  collectNodesByType,
  createManualJournal,
  expectDelta,
  fetchAccountsByCode,
  fetchBalanceSheet,
  findNode,
} from './_utils/balance-sheet';

const FY2023 = { fromDate: '2023-01-01', toDate: '2023-12-31' };
const YEARS_2022_2023 = { fromDate: '2022-01-01', toDate: '2023-12-31' };

/**
 * Fixture journals posted on top of the baseline (deltas expected in the
 * report): opening balances in 2022 then operating activity in 2023 plus one
 * out-of-range transaction that must never leak into FY2023 columns.
 *
 * A/R and A/P entries must carry a customer/vendor contact respectively.
 */
const FIXTURE_JOURNALS = (customerId: number, vendorId: number) => [
  // Owner contributes capital, FY2022.
  {
    date: '2022-06-01',
    entries: [
      { code: '10001', debit: 10000 },
      { code: '30003', credit: 10000 },
    ],
  },
  // Credit sale, FY2022.
  {
    date: '2022-06-02',
    entries: [
      { code: '10007', debit: 500, contactId: customerId },
      { code: '50002', credit: 500 },
    ],
  },
  // Cash sale, FY2023.
  {
    date: '2023-01-15',
    entries: [
      { code: '10001', debit: 3000 },
      { code: '50002', credit: 3000 },
    ],
  },
  // Unpaid expense (bill), FY2023.
  {
    date: '2023-02-10',
    entries: [
      { code: '40004', debit: 800 },
      { code: '20001', credit: 800, contactId: vendorId },
    ],
  },
  // Bill payment, FY2023.
  {
    date: '2023-03-01',
    entries: [
      { code: '20001', debit: 300, contactId: vendorId },
      { code: '10001', credit: 300 },
    ],
  },
  // Unearned revenue received, FY2023.
  {
    date: '2023-04-01',
    entries: [
      { code: '10001', debit: 200 },
      { code: '50005', credit: 200 },
    ],
  },
  // Fixed asset purchase, FY2023.
  {
    date: '2023-05-01',
    entries: [
      { code: '10005', debit: 1200 },
      { code: '10001', credit: 1200 },
    ],
  },
  // Cash transfer to petty cash, FY2023.
  {
    date: '2023-06-01',
    entries: [
      { code: '10004', debit: 100 },
      { code: '10001', credit: 100 },
    ],
  },
  // Out-of-range: dated after FY2023 toDate.
  {
    date: '2024-01-01',
    entries: [
      { code: '10001', debit: 999 },
      { code: '50002', credit: 999 },
    ],
  },
];

describe('Balance Sheet (e2e)', () => {
  let accountsByCode: AccountsByCode;
  let bankId: number;
  let pettyCashId: number;
  let accountsReceivableId: number;
  let computerEquipmentId: number;

  // Baselines captured before the fixture is seeded.
  let baseline: { data: BSNode[] };
  let baselinePY: { data: BSNode[] };
  let baselinePP: { data: BSNode[] };
  let baselinePeriods: { data: BSNode[] };
  let baselineExtended: { data: BSNode[] };

  beforeAll(async () => {
    await cancelTransactionsLock();
    accountsByCode = await fetchAccountsByCode();

    const baseCurrency = await getBaseCurrency();
    const customerId = await createCustomer(baseCurrency);
    const vendorId = await createVendor(baseCurrency);

    baseline = await fetchBalanceSheet(FY2023);
    baselinePY = await fetchBalanceSheet({ ...FY2023, previousYear: true });
    baselinePP = await fetchBalanceSheet({ ...FY2023, previousPeriod: true });
    baselinePeriods = await fetchBalanceSheet({
      ...YEARS_2022_2023,
      displayColumnsType: 'date_periods',
      displayColumnsBy: 'year',
    });
    baselineExtended = await fetchBalanceSheet({
      fromDate: '2023-01-01',
      toDate: '2024-12-31',
    });

    for (const journal of FIXTURE_JOURNALS(customerId, vendorId)) {
      await createManualJournal(accountsByCode, journal);
    }

    bankId = accountsByCode['10001'].id;
    pettyCashId = accountsByCode['10004'].id;
    accountsReceivableId = accountsByCode['10007'].id;
    computerEquipmentId = accountsByCode['10005'].id;
  });

  describe('Report structure', () => {
    let data: BSNode[];

    beforeAll(async () => {
      ({ data } = await fetchBalanceSheet(FY2023));
    });

    it('returns the assets and liabilities and equity sections', () => {
      expect(data).toHaveLength(2);

      const [assets, liabilityEquity] = data;
      expect(assets.id).toBe('ASSETS');
      expect(assets.node_type).toBe('AGGREGATE');
      expect(liabilityEquity.id).toBe('LIABILITY_EQUITY');
      expect(liabilityEquity.node_type).toBe('AGGREGATE');
    });

    it('organizes assets into current assets, fixed and non-current sections', () => {
      const assets = findNode(data, 'ASSETS');
      expect(assets.children.map((c) => c.id)).toEqual(
        expect.arrayContaining([
          'CURRENT_ASSETS',
          'FIXED_ASSET',
          'NON_CURRENT_ASSET',
        ]),
      );

      const currentAssets = findNode(data, 'CURRENT_ASSETS');
      expect(currentAssets.node_type).toBe('AGGREGATE');
      expect(currentAssets.children.map((c) => c.id)).toEqual(
        expect.arrayContaining([
          'CASH_EQUIVALENTS',
          'ACCOUNTS_RECEIVABLE',
          'INVENTORY',
          'OTHER_CURRENT_ASSET',
        ]),
      );
    });

    it('organizes liabilities and equity with a net income node under equity', () => {
      const liabilityEquity = findNode(data, 'LIABILITY_EQUITY');
      expect(liabilityEquity.children.map((c) => c.id)).toEqual(
        expect.arrayContaining(['LIABILITY', 'EQUITY']),
      );

      const liabilities = findNode(data, 'LIABILITY');
      expect(liabilities.node_type).toBe('AGGREGATE');
      expect(liabilities.children.map((c) => c.id)).toEqual(
        expect.arrayContaining([
          'CURRENT_LIABILITY',
          'LOGN_TERM_LIABILITY',
          'NON_CURRENT_LIABILITY',
        ]),
      );

      const equity = findNode(data, 'EQUITY');
      const netIncome = equity.children.find((c) => c.id === 'NET_INCOME');
      expect(netIncome).toBeDefined();
      expect(netIncome.node_type).toBe('NET_INCOME');
    });

    it('carries a name, node type and amount meta on every node', () => {
      const walk = (nodes: BSNode[]) =>
        (nodes ?? []).forEach((node) => {
          expect(node.name).toBeDefined();
          expect(node.node_type).toBeDefined();
          expect(node.total).toBeDefined();
          expect(typeof node.total.amount).toBe('number');
          expect(node.total.currency_code).toBeDefined();
          walk(node.children ?? []);
        });
      walk(data);
    });
  });

  describe('Account balances and classification', () => {
    let data: BSNode[];
    let before: Record<string | number, number>;

    beforeAll(async () => {
      ({ data } = await fetchBalanceSheet(FY2023));
      before = accountTotalsMap(baseline.data);
    });

    it('reports the bank account under cash and cash equivalents', () => {
      const bank = findNode(data, bankId);
      expect(bank).toBeDefined();
      expect(bank.code).toBe('10001');

      const cashNode = findNode(data, 'CASH_EQUIVALENTS');
      expect(cashNode.children.find((c) => c.id === bankId)).toBeDefined();

      expectDelta(bank.total.amount, before[bankId] ?? 0, 11600);
    });

    it('reports the petty cash account under cash and cash equivalents', () => {
      const pettyCash = findNode(data, pettyCashId);
      expect(pettyCash).toBeDefined();
      expect(pettyCash.code).toBe('10004');

      const cashNode = findNode(data, 'CASH_EQUIVALENTS');
      expect(cashNode.children.find((c) => c.id === pettyCashId)).toBeDefined();

      expectDelta(pettyCash.total.amount, before[pettyCashId] ?? 0, 100);
    });

    it('aggregates cash and cash equivalents balances', () => {
      const cashNode = findNode(data, 'CASH_EQUIVALENTS');
      const beforeCash = findNode(baseline.data, 'CASH_EQUIVALENTS').total
        .amount;

      expectDelta(cashNode.total.amount, beforeCash, 11700);
      expect(cashNode.total.amount).toBeCloseTo(childrenTotalSum(cashNode), 2);
    });

    it('reports the receivable balance under accounts receivable', () => {
      const receivable = findNode(data, accountsReceivableId);
      expect(receivable).toBeDefined();
      expect(receivable.code).toBe('10007');
      expectDelta(
        receivable.total.amount,
        before[accountsReceivableId] ?? 0,
        500,
      );

      const receivableNode = findNode(data, 'ACCOUNTS_RECEIVABLE');
      expect(
        receivableNode.children.find((c) => c.id === accountsReceivableId),
      ).toBeDefined();
    });

    it('reports the equipment purchase under fixed assets', () => {
      const equipment = findNode(data, computerEquipmentId);
      expect(equipment).toBeDefined();
      expect(equipment.code).toBe('10005');
      expectDelta(
        equipment.total.amount,
        before[computerEquipmentId] ?? 0,
        1200,
      );

      const fixedAssets = findNode(data, 'FIXED_ASSET');
      expect(
        fixedAssets.children.find((c) => c.id === computerEquipmentId),
      ).toBeDefined();
    });

    it('reports the remaining payable and unearned revenue under current liabilities', () => {
      const payableId = accountsByCode['20001'].id;
      const unearnedId = accountsByCode['50005'].id;

      const payable = findNode(data, payableId);
      expectDelta(payable.total.amount, before[payableId] ?? 0, 500);

      const unearned = findNode(data, unearnedId);
      expectDelta(unearned.total.amount, before[unearnedId] ?? 0, 200);

      const currentLiabilities = findNode(data, 'CURRENT_LIABILITY');
      expect(
        currentLiabilities.children.find((c) => c.id === payableId),
      ).toBeDefined();
      expect(
        currentLiabilities.children.find((c) => c.id === unearnedId),
      ).toBeDefined();

      const beforeCurrent = findNode(baseline.data, 'CURRENT_LIABILITY').total
        .amount;
      expectDelta(currentLiabilities.total.amount, beforeCurrent, 700);
    });

    it('reports the owner contribution under equity', () => {
      const ownerId = accountsByCode['30003'].id;
      const ownerEquity = findNode(data, ownerId);
      expect(ownerEquity).toBeDefined();
      expectDelta(ownerEquity.total.amount, before[ownerId] ?? 0, 10000);

      const equityNode = findNode(data, 'EQUITY');
      expect(equityNode.children.find((c) => c.id === ownerId)).toBeDefined();
    });

    it('keeps zero-balance accounts visible by default', () => {
      const retained = findNode(data, accountsByCode['30001'].id);
      expect(retained).toBeDefined();
      expect(retained.total.amount).toBeCloseTo(0, 2);
    });

    it('computes net income as cumulative income minus expenses', () => {
      const netIncome = findNode(data, 'NET_INCOME');
      const beforeNetIncome = findNode(baseline.data, 'NET_INCOME').total
        .amount;

      expectDelta(netIncome.total.amount, beforeNetIncome, 2700);
    });
  });

  describe('Aggregation and the accounting equation', () => {
    let data: BSNode[];

    beforeAll(async () => {
      ({ data } = await fetchBalanceSheet(FY2023));
    });

    it('computes aggregate and accounts totals from their children', () => {
      const groups = [
        ...collectNodesByType(data, 'AGGREGATE'),
        ...collectNodesByType(data, 'ACCOUNTS'),
      ];

      for (const node of groups) {
        expect(node.total.amount).toBeCloseTo(childrenTotalSum(node), 2);
      }
    });

    it('balances the seeded activity against both sides of the equation', () => {
      // The pre-existing tenant data may include unbalanced legacy entries,
      // so the accounting equation is asserted on the seeded activity only:
      // balanced journals must increase both sides by the same amount.
      const assetsBefore = findNode(baseline.data, 'ASSETS').total.amount;
      const assetsAfter = findNode(data, 'ASSETS').total.amount;
      expectDelta(assetsAfter, assetsBefore, 13400);

      const leBefore = findNode(baseline.data, 'LIABILITY_EQUITY').total.amount;
      const leAfter = findNode(data, 'LIABILITY_EQUITY').total.amount;
      expectDelta(leAfter, leBefore, 13400);
      expect(assetsAfter - assetsBefore).toBeCloseTo(leAfter - leBefore, 2);
    });
  });

  describe('Date range', () => {
    let data: BSNode[];
    let before: Record<string | number, number>;

    beforeAll(async () => {
      ({ data } = await fetchBalanceSheet(FY2023));
      before = accountTotalsMap(baseline.data);
    });

    it('excludes transactions dated after the toDate', () => {
      const bank = findNode(data, bankId);
      expectDelta(bank.total.amount, before[bankId] ?? 0, 11600);

      const netIncome = findNode(data, 'NET_INCOME');
      const beforeNetIncome = findNode(baseline.data, 'NET_INCOME').total
        .amount;
      expectDelta(netIncome.total.amount, beforeNetIncome, 2700);
    });

    it('includes the out-of-range transaction once the toDate extends', async () => {
      const { data: extended } = await fetchBalanceSheet({
        fromDate: '2023-01-01',
        toDate: '2024-12-31',
      });

      // Compared against a baseline captured with the same extended range so
      // transactions of other spec files dated within 2024 cancel out.
      const bank = findNode(extended, bankId);
      const beforeExtendedBank = findNode(baselineExtended.data, bankId).total
        .amount;
      expectDelta(bank.total.amount, beforeExtendedBank, 12599);
    });

    it('ignores the fromDate for total columns (closing balances)', async () => {
      const { data: shifted } = await fetchBalanceSheet({
        ...FY2023,
        fromDate: '2023-06-01',
      });

      const bank = findNode(shifted, bankId);
      expect(bank.total.amount).toBeCloseTo(
        findNode(data, bankId).total.amount,
        2,
      );
    });
  });

  describe('Date periods columns', () => {
    let data: BSNode[];

    beforeAll(async () => {
      ({ data } = await fetchBalanceSheet({
        ...YEARS_2022_2023,
        displayColumnsType: 'date_periods',
        displayColumnsBy: 'year',
      }));
    });

    it('emits one period column per year', () => {
      const bank = findNode(data, bankId);
      expect(bank.horizontal_totals).toHaveLength(2);
    });

    it('carries cumulative closing balances per period end', () => {
      const bank = findNode(data, bankId);
      const beforeBank = findNode(
        baselinePeriods.data,
        bankId,
      ).horizontal_totals;

      expectDelta(
        bank.horizontal_totals[0].total.amount,
        beforeBank[0].total.amount,
        10000,
      );
      expectDelta(
        bank.horizontal_totals[1].total.amount,
        beforeBank[1].total.amount,
        11600,
      );
      expect(bank.horizontal_totals[1].total.amount).toBeCloseTo(
        bank.total.amount,
        2,
      );
    });

    it('computes aggregate period columns from their children', () => {
      const currentAssets = findNode(data, 'CURRENT_ASSETS');

      for (const index of [0, 1]) {
        const childrenSum = currentAssets.children.reduce(
          (sum, child) => sum + child.horizontal_totals[index].total.amount,
          0,
        );
        expect(currentAssets.horizontal_totals[index].total.amount).toBeCloseTo(
          childrenSum,
          2,
        );
      }
    });

    it('accumulates net income per period end', () => {
      const netIncome = findNode(data, 'NET_INCOME');
      const beforeNetIncome = findNode(
        baselinePeriods.data,
        'NET_INCOME',
      ).horizontal_totals;

      expectDelta(
        netIncome.horizontal_totals[0].total.amount,
        beforeNetIncome[0].total.amount,
        500,
      );
      expectDelta(
        netIncome.horizontal_totals[1].total.amount,
        beforeNetIncome[1].total.amount,
        2700,
      );
      expect(netIncome.horizontal_totals[1].total.amount).toBeCloseTo(
        netIncome.total.amount,
        2,
      );
    });
  });

  describe('Date periods with previous period/year comparison', () => {
    it('attaches previous period totals to the net income period columns', async () => {
      const { data } = await fetchBalanceSheet({
        ...YEARS_2022_2023,
        displayColumnsType: 'date_periods',
        displayColumnsBy: 'year',
        previousPeriod: true,
        previousPeriodAmountChange: true,
        previousPeriodPercentageChange: true,
      });

      const netIncome = findNode(data, 'NET_INCOME');

      for (const totalNode of netIncome.horizontal_totals) {
        expect(totalNode.previous_period).toBeDefined();
        expect(totalNode.previous_period_change).toBeDefined();
        expect(totalNode.previous_period_percentage).toBeDefined();
        expect(totalNode.previous_period_from_date).toBeDefined();
        expect(totalNode.previous_period_to_date).toBeDefined();
        expect(totalNode.previous_period_change.amount).toBeCloseTo(
          totalNode.total.amount - totalNode.previous_period.amount,
          2,
        );
      }

      // The previous period of the 2023 column is the 2022 net income.
      expect(netIncome.horizontal_totals[1].previous_period.amount).toBeCloseTo(
        netIncome.horizontal_totals[0].total.amount,
        2,
      );
    });

    it('attaches previous period totals to account period columns', async () => {
      const { data } = await fetchBalanceSheet({
        ...YEARS_2022_2023,
        displayColumnsType: 'date_periods',
        displayColumnsBy: 'year',
        previousPeriod: true,
      });

      const bank = findNode(data, bankId);
      expect(bank.horizontal_totals[1].previous_period.amount).toBeCloseTo(
        bank.horizontal_totals[0].total.amount,
        2,
      );
    });

    it('attaches previous year totals to the net income period columns', async () => {
      const { data } = await fetchBalanceSheet({
        ...YEARS_2022_2023,
        displayColumnsType: 'date_periods',
        displayColumnsBy: 'year',
        previousYear: true,
        previousYearAmountChange: true,
        previousYearPercentageChange: true,
      });

      const netIncome = findNode(data, 'NET_INCOME');

      for (const totalNode of netIncome.horizontal_totals) {
        expect(totalNode.previous_year).toBeDefined();
        expect(totalNode.previous_year_change).toBeDefined();
        expect(totalNode.previous_year_percentage).toBeDefined();
        expect(totalNode.previous_year_from_date).toBeDefined();
        expect(totalNode.previous_year_to_date).toBeDefined();
        expect(totalNode.previous_year_change.amount).toBeCloseTo(
          totalNode.total.amount - totalNode.previous_year.amount,
          2,
        );
      }

      expect(netIncome.horizontal_totals[1].previous_year.amount).toBeCloseTo(
        netIncome.horizontal_totals[0].total.amount,
        2,
      );
    });
  });

  describe('Previous year comparison', () => {
    let data: BSNode[];
    let beforePY: Record<string | number, number>;

    beforeAll(async () => {
      ({ data } = await fetchBalanceSheet({ ...FY2023, previousYear: true }));

      beforePY = collectAccountNodes(baselinePY.data).reduce(
        (map, node) => ({ ...map, [node.id]: node.previous_year.amount }),
        {} as Record<string | number, number>,
      );
    });

    it('attaches previous year totals to account nodes', () => {
      const bank = findNode(data, bankId);
      expect(bank.previous_year).toBeDefined();
      expectDelta(bank.previous_year.amount, beforePY[bankId] ?? 0, 10000);

      const receivable = findNode(data, accountsReceivableId);
      expectDelta(
        receivable.previous_year.amount,
        beforePY[accountsReceivableId] ?? 0,
        500,
      );
    });

    it('attaches the previous year net income', () => {
      const netIncome = findNode(data, 'NET_INCOME');
      const beforeNetIncome = findNode(baselinePY.data, 'NET_INCOME')
        .previous_year.amount;

      expectDelta(netIncome.previous_year.amount, beforeNetIncome, 500);
    });

    it('reports the amount change as the total minus the previous year', async () => {
      const { data: withChange } = await fetchBalanceSheet({
        ...FY2023,
        previousYear: true,
        previousYearAmountChange: true,
      });

      const bank = findNode(withChange, bankId);
      expect(bank.previous_year_change).toBeDefined();
      expect(bank.previous_year_change.amount).toBeCloseTo(
        bank.total.amount - bank.previous_year.amount,
        2,
      );
    });

    it('balances the previous year columns', () => {
      const assets = findNode(data, 'ASSETS');
      const liabilityEquity = findNode(data, 'LIABILITY_EQUITY');

      expect(assets.previous_year.amount).toBeCloseTo(
        liabilityEquity.previous_year.amount,
        2,
      );
    });
  });

  describe('Previous period comparison', () => {
    let data: BSNode[];
    let beforePP: Record<string | number, number>;

    beforeAll(async () => {
      ({ data } = await fetchBalanceSheet({ ...FY2023, previousPeriod: true }));

      beforePP = collectAccountNodes(baselinePP.data).reduce(
        (map, node) => ({ ...map, [node.id]: node.previous_period.amount }),
        {} as Record<string | number, number>,
      );
    });

    it('resolves the previous period as the preceding annual period', () => {
      const bank = findNode(data, bankId);
      expect(bank.previous_period).toBeDefined();
      expectDelta(bank.previous_period.amount, beforePP[bankId] ?? 0, 10000);
    });

    it('matches the previous year total for an annual range', async () => {
      const { data: withPY } = await fetchBalanceSheet({
        ...FY2023,
        previousYear: true,
      });

      const bankPP = findNode(data, bankId).previous_period.amount;
      const bankPY = findNode(withPY, bankId).previous_year.amount;
      expect(bankPP).toBeCloseTo(bankPY, 2);
    });
  });

  describe('Report filtering', () => {
    it('excludes zero-balance accounts with noneZero', async () => {
      const { data } = await fetchBalanceSheet({ ...FY2023, noneZero: true });

      const accountNodes = collectAccountNodes(data);
      expect(accountNodes.length).toBeGreaterThan(0);

      for (const node of accountNodes) {
        expect(node.total.amount).not.toBe(0);
      }

      const defaultAccounts = collectAccountNodes(
        (await fetchBalanceSheet(FY2023)).data,
      );
      expect(accountNodes.length).toBeLessThan(defaultAccounts.length);
    });

    it('excludes zero-balance accounts with noneTransactions', async () => {
      const { data } = await fetchBalanceSheet({
        ...FY2023,
        noneTransactions: true,
      });

      for (const node of collectAccountNodes(data)) {
        expect(node.total.amount).not.toBe(0);
      }
    });
  });

  describe('Percentage columns', () => {
    it('computes the percentage of column per node', async () => {
      const { data } = await fetchBalanceSheet({
        ...FY2023,
        percentageOfColumn: true,
      });

      const assets = findNode(data, 'ASSETS');
      expect(assets.percentage_column).toBeDefined();

      const childrenPercentages = assets.children.reduce(
        (sum, child) => sum + child.percentage_column.amount,
        0,
      );
      expect(childrenPercentages).toBeCloseTo(1, 2);

      const bank = findNode(data, bankId);
      expect(bank.percentage_column).toBeDefined();
      expect(bank.percentage_column.formatted_amount).toContain('%');
    });
  });

  describe('Report formats', () => {
    const baseQuery = { ...FY2023 };

    it('serves the table format through the accept header', async () => {
      const res = await request(app.getHttpServer())
        .get('/reports/balance-sheet')
        .query(baseQuery)
        .set({ ...authHeaders(), Accept: 'application/json+table' })
        .expect(200)
        .expect('Content-Type', /json/);

      const { table } = res.body;
      expect(table).toBeDefined();
      expect(Array.isArray(table.columns)).toBe(true);
      expect(Array.isArray(table.rows)).toBe(true);

      const keys = table.columns.map((c) => c.key);
      expect(keys).toEqual(expect.arrayContaining(['name', 'total']));

      const allRows: BSNode[] = [];
      const walkRows = (nodes: BSNode[]) =>
        (nodes ?? []).forEach((node) => {
          allRows.push(node);
          walkRows(node.children ?? []);
        });
      walkRows(table.rows);

      const assetsRow = allRows.find((row) => row.id === 'ASSETS');
      expect(assetsRow).toBeDefined();
      expect(assetsRow.cells[0].key).toBe('name');
      expect(assetsRow.cells[1].key).toBe('total');
      expect(assetsRow.row_types).toContain('AGGREGATE');
      expect(allRows.some((row) => row.row_types?.includes('TOTAL'))).toBe(
        true,
      );
    });

    it('serves the csv format through the accept header', async () => {
      const res = await request(app.getHttpServer())
        .get('/reports/balance-sheet')
        .query(baseQuery)
        .set({ ...authHeaders(), Accept: 'application/csv' })
        .expect(200)
        .expect('Content-Type', /text\/csv/);

      expect(typeof res.text).toBe('string');
      expect(res.text).toContain('Total');
      expect(res.text.split('\n').length).toBeGreaterThan(3);
    });

    it('serves the xlsx format through the accept header', async () => {
      const res = await request(app.getHttpServer())
        .get('/reports/balance-sheet')
        .query(baseQuery)
        .set({ ...authHeaders(), Accept: 'application/xlsx' })
        .buffer(true)
        .parse((message, callback) => {
          const chunks: Buffer[] = [];
          message.on('data', (chunk) => chunks.push(chunk));
          message.on('end', () => callback(null, Buffer.concat(chunks)));
        })
        .expect(200)
        .expect(
          'Content-Type',
          /application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/,
        );

      expect(Buffer.isBuffer(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      // XLSX is a zip archive: starts with the PK magic bytes.
      expect(res.body[0]).toBe(0x50);
      expect(res.body[1]).toBe(0x4b);
    });
  });

  describe('Report meta', () => {
    it('returns the report metadata with the response', async () => {
      const res = await fetchBalanceSheet(FY2023);

      expect(res.meta).toBeDefined();
      expect(res.meta.base_currency).toBeDefined();
      expect(res.meta.sheet_name).toBeDefined();
      expect(res.meta.organization_name).toBeDefined();
      expect(res.query.from_date).toBe('2023-01-01');
      expect(res.query.to_date).toBe('2023-12-31');
    });
  });
});
