import { I18nService } from 'nestjs-i18n';
import { ACCOUNT_ROOT_TYPE, ACCOUNT_TYPE } from '@/constants/accounts';
import { Ledger } from '@/modules/Ledger/Ledger';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { CashFlowStatement } from './CashFlow';
import { ICashFlowStatementQuery } from './Cashflow.types';

const query: ICashFlowStatementQuery = {
  fromDate: '2023-01-01',
  toDate: '2023-12-31',
  displayColumnsBy: 'day',
  displayColumnsType: 'total',
  noneZero: false,
  noneTransactions: false,
  basis: 'cash',
  numberFormat: {
    precision: 2,
    divideOn1000: false,
    showZero: false,
    formatMoney: 'total',
    negativeFormat: 'mines',
  },
};

const incomeAccount = {
  id: 1,
  code: '50002',
  name: 'Sales of Service Income',
  accountType: ACCOUNT_TYPE.INCOME,
  accountRootType: ACCOUNT_ROOT_TYPE.INCOME,
};

const expenseAccount = {
  id: 2,
  code: '40004',
  name: 'Rent',
  accountType: ACCOUNT_TYPE.EXPENSE,
  accountRootType: ACCOUNT_ROOT_TYPE.EXPENSE,
};

const bankAccount = {
  id: 3,
  code: '10001',
  name: 'Bank Account',
  accountType: ACCOUNT_TYPE.BANK,
  accountRootType: ACCOUNT_ROOT_TYPE.ASSET,
};

const entry = (overrides: Partial<ILedgerEntry>): ILedgerEntry => ({
  id: 1,
  credit: 0,
  debit: 0,
  currencyCode: 'USD',
  exchangeRate: 1,
  accountId: incomeAccount.id,
  accountNormal: 'debit',
  date: '2023-02-05',
  transactionType: 'Journal',
  transactionId: 1,
  transactionNumber: 'JV-1',
  index: 1,
  ...overrides,
});

/**
 * Cash sale of 3,000 and rent expense of 450 paid from the bank account,
 * reproducing the fixture of issue #1417: net income 2,550 and a bank
 * balance increase of 2,550 with an empty prior period.
 */
const fixtureEntries = (): ILedgerEntry[] => [
  entry({
    id: 1,
    credit: 3000,
    accountId: incomeAccount.id,
    accountNormal: 'credit',
  }),
  entry({ id: 2, debit: 3000, accountId: bankAccount.id }),
  entry({
    id: 3,
    debit: 450,
    accountId: expenseAccount.id,
    date: '2023-02-08',
  }),
  entry({
    id: 4,
    credit: 450,
    accountId: bankAccount.id,
    date: '2023-02-08',
  }),
];

const findNode = (nodes, id: string) => {
  for (const node of nodes ?? []) {
    if (node.id === id) return node;
    const found = findNode(node.children ?? [], id);
    if (found) return found;
  }
  return undefined;
};

const buildReport = (overrides: Partial<ICashFlowStatementQuery> = {}) => {
  const ledger = new Ledger(fixtureEntries());
  const i18n = { t: (key: string) => key } as unknown as I18nService;

  return new CashFlowStatement(
    [incomeAccount, expenseAccount, bankAccount] as any,
    ledger,
    new Ledger([]),
    ledger,
    { ...query, ...overrides },
    i18n,
    { baseCurrency: 'USD', dateFormat: 'YYYY MMM DD' },
  ).reportData();
};

describe('CashFlowStatement', () => {
  it('associates the operating activities total from its children', () => {
    const report = buildReport();
    const operating = findNode(report, 'OPERATING');
    const netIncome = findNode(report, 'NET_INCOME');
    const operatingAccounts = findNode(report, 'OPERATING_ACCOUNTS');

    expect(netIncome.total.amount).toBeCloseTo(2550, 2);
    expect(operatingAccounts.total.amount).toBeCloseTo(0, 2);

    expect(operating.total).toBeDefined();
    expect(operating.total.amount).toBeCloseTo(2550, 2);
    expect(operating.total.amount).toBeCloseTo(
      netIncome.total.amount + operatingAccounts.total.amount,
      2,
    );
  });

  it('includes the operating activities in the net cash increase and end cash', () => {
    const report = buildReport();
    const operating = findNode(report, 'OPERATING');
    const cashBeginning = findNode(report, 'CASH_BEGINNING_PERIOD');
    const netCashIncrease = findNode(report, 'NET_CASH_INCREASE');
    const cashEnd = findNode(report, 'CASH_END_PERIOD');

    expect(cashBeginning.total.amount).toBeCloseTo(0, 2);
    expect(netCashIncrease.total.amount).toBeCloseTo(2550, 2);
    expect(netCashIncrease.total.amount).toBeCloseTo(operating.total.amount, 2);
    expect(cashEnd.total.amount).toBeCloseTo(2550, 2);
    expect(cashEnd.total.amount).toBeCloseTo(
      netCashIncrease.total.amount + cashBeginning.total.amount,
      2,
    );
  });

  it('keeps the operating activities total on date periods mode', () => {
    const report = buildReport({
      fromDate: '2022-01-01',
      toDate: '2023-12-31',
      displayColumnsType: 'date_periods',
      displayColumnsBy: 'year',
    });
    const operating = findNode(report, 'OPERATING');

    expect(operating.total).toBeDefined();
    expect(operating.total.amount).toBeCloseTo(2550, 2);
    expect(operating.periods).toHaveLength(2);
    expect(operating.periods[1].total.amount).toBeCloseTo(2550, 2);
  });
});
