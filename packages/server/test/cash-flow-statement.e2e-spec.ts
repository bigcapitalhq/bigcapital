import {
  AccountsByCode,
  createManualJournal,
  fetchAccountsByCode,
} from './_utils/balance-sheet';
import { cancelTransactionsLock } from './_utils/gl';
import {
  CashFlowNode,
  CashFlowTable,
  fetchCashFlowStatement,
  fetchCashFlowTable,
  findCashFlowNode,
  findCashFlowRow,
} from './_utils/cash-flow';

const FY2023 = { fromDate: '2023-01-01', toDate: '2023-12-31' };
const NET_INCOME = 2550;
const CASH_INCREASE = 2550;

/**
 * Fixture journals reproducing issue #1417 on top of the baseline captured in
 * `beforeAll`: a 3,000 cash sale and a 450 rent expense paid from the bank
 * account, i.e. net income 2,550 and a cash increase of 2,550.
 */
const FIXTURE_JOURNALS = [
  {
    date: '2023-02-05',
    entries: [
      { code: '10001', debit: 3000 },
      { code: '50002', credit: 3000 },
    ],
  },
  {
    date: '2023-02-08',
    entries: [
      { code: '40004', debit: 450 },
      { code: '10001', credit: 450 },
    ],
  },
];

describe('Cash Flow Statement (e2e)', () => {
  let accountsByCode: AccountsByCode;

  // Baselines captured before the fixture is seeded.
  let baseline: { data: CashFlowNode[] };
  let baselineTable: { table: CashFlowTable };

  beforeAll(async () => {
    await cancelTransactionsLock();
    accountsByCode = await fetchAccountsByCode();

    baseline = await fetchCashFlowStatement(FY2023);
    baselineTable = await fetchCashFlowTable(FY2023);

    for (const journal of FIXTURE_JOURNALS) {
      await createManualJournal(accountsByCode, journal);
    }
  });

  it('aggregates the operating activities total from its children', async () => {
    const { data } = await fetchCashFlowStatement(FY2023);

    const operating = findCashFlowNode(data, 'OPERATING');
    const baselineOperating = findCashFlowNode(baseline.data, 'OPERATING');
    const netIncome = findCashFlowNode(data, 'NET_INCOME');
    const operatingAccounts = findCashFlowNode(data, 'OPERATING_ACCOUNTS');

    expect(netIncome).toBeDefined();
    expect(operatingAccounts).toBeDefined();

    expect(operating).toBeDefined();
    expect(operating.total).toBeDefined();
    expect(operating.total.amount).toBeCloseTo(
      (baselineOperating?.total?.amount ?? 0) + NET_INCOME,
      2,
    );
    expect(operating.total.amount).toBeCloseTo(
      netIncome.total.amount + operatingAccounts.total.amount,
      2,
    );
  });

  it('includes the operating activities in the net cash increase and end cash', async () => {
    const { data } = await fetchCashFlowStatement(FY2023);

    const operating = findCashFlowNode(data, 'OPERATING');
    const baselineOperating = findCashFlowNode(baseline.data, 'OPERATING');
    const cashBeginning = findCashFlowNode(data, 'CASH_BEGINNING_PERIOD');
    const netCashIncrease = findCashFlowNode(data, 'NET_CASH_INCREASE');
    const baselineNetCashIncrease = findCashFlowNode(
      baseline.data,
      'NET_CASH_INCREASE',
    );
    const cashEnd = findCashFlowNode(data, 'CASH_END_PERIOD');
    const baselineCashEnd = findCashFlowNode(baseline.data, 'CASH_END_PERIOD');

    expect(operating.total.amount - baselineOperating.total.amount).toBeCloseTo(
      CASH_INCREASE,
      2,
    );
    expect(
      netCashIncrease.total.amount - baselineNetCashIncrease.total.amount,
    ).toBeCloseTo(CASH_INCREASE, 2);
    expect(cashEnd.total.amount - baselineCashEnd.total.amount).toBeCloseTo(
      CASH_INCREASE,
      2,
    );
    expect(cashEnd.total.amount).toBeCloseTo(
      netCashIncrease.total.amount + cashBeginning.total.amount,
      2,
    );
  });

  it('renders the operating activities total in the table representation', async () => {
    const { data } = await fetchCashFlowStatement(FY2023);
    const { table } = await fetchCashFlowTable(FY2023);

    const operating = findCashFlowNode(data, 'OPERATING');
    const operatingRow = findCashFlowRow(table.rows, 'OPERATING');
    const baselineOperatingRow = findCashFlowRow(
      baselineTable.table.rows,
      'OPERATING',
    );

    expect(operatingRow).toBeDefined();
    expect(baselineOperatingRow).toBeDefined();

    const totalCell = operatingRow.cells.find((cell) => cell.key === 'total');
    const baselineTotalCell = baselineOperatingRow.cells.find(
      (cell) => cell.key === 'total',
    );

    expect(totalCell).toBeDefined();
    expect(totalCell.value).not.toBe('');
    expect(totalCell.value).toBe(operating.total.formatted_amount);
    expect(baselineTotalCell.value).not.toBe('');
  });
});
