import {
  AccountsByCode,
  createManualJournal,
  fetchAccountsByCode,
} from './_utils/balance-sheet';
import { cancelTransactionsLock } from './_utils/gl';
import {
  CashFlowNode,
  fetchCashFlowStatement,
  findCashFlowNode,
} from './_utils/cash-flow';

const FY2023 = { fromDate: '2023-01-01', toDate: '2023-12-31' };
const PRIOR_PERIOD_CASH = 1000;

/**
 * Regression coverage for the "Cash at beginning of period" row: a journal
 * dated before the report range must be reflected in both the total-mode
 * beginning cash and the per-period opening column.
 */
describe('Cash Flow Statement — cash at beginning of period (e2e)', () => {
  let accountsByCode: AccountsByCode;

  // Baselines captured before the prior-period fixture is seeded.
  let baselineBeginning: CashFlowNode | undefined;
  let baselinePeriodsBeginning: CashFlowNode | undefined;

  beforeAll(async () => {
    await cancelTransactionsLock();
    accountsByCode = await fetchAccountsByCode();

    const { data } = await fetchCashFlowStatement(FY2023);
    baselineBeginning = findCashFlowNode(data, 'CASH_BEGINNING_PERIOD');

    const { data: periodsData } = await fetchCashFlowStatement({
      ...FY2023,
      displayColumnsType: 'date_periods',
      displayColumnsBy: 'year',
    });
    baselinePeriodsBeginning = findCashFlowNode(
      periodsData,
      'CASH_BEGINNING_PERIOD',
    );

    await createManualJournal(accountsByCode, {
      date: '2022-06-15',
      entries: [
        { code: '10001', debit: PRIOR_PERIOD_CASH },
        { code: '30002', credit: PRIOR_PERIOD_CASH },
      ],
    });
  });

  it('reports the prior-period cash in the cash at beginning of period', async () => {
    const { data } = await fetchCashFlowStatement(FY2023);
    const cashBeginning = findCashFlowNode(data, 'CASH_BEGINNING_PERIOD');
    const netCashIncrease = findCashFlowNode(data, 'NET_CASH_INCREASE');
    const cashEnd = findCashFlowNode(data, 'CASH_END_PERIOD');

    expect(cashBeginning).toBeDefined();
    expect(
      cashBeginning.total.amount - (baselineBeginning?.total.amount ?? 0),
    ).toBeCloseTo(PRIOR_PERIOD_CASH, 2);
    expect(cashEnd.total.amount).toBeCloseTo(
      netCashIncrease.total.amount + cashBeginning.total.amount,
      2,
    );
  });

  it('reports the prior-period cash in the per-period opening column', async () => {
    const { data } = await fetchCashFlowStatement({
      ...FY2023,
      displayColumnsType: 'date_periods',
      displayColumnsBy: 'year',
    });
    const cashBeginning = findCashFlowNode(data, 'CASH_BEGINNING_PERIOD');
    const baselinePeriods = baselinePeriodsBeginning?.periods ?? [];

    expect(cashBeginning.periods).toHaveLength(1);
    expect(
      cashBeginning.periods[0].total.amount -
        (baselinePeriods[0]?.total?.amount ?? 0),
    ).toBeCloseTo(PRIOR_PERIOD_CASH, 2);
  });
});
