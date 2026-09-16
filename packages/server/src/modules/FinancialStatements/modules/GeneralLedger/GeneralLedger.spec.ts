import { last } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { Ledger } from '@/modules/Ledger/Ledger';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { GeneralLedgerRepository } from './GeneralLedgerRepository';
import { GeneralLedgerSheet } from './GeneralLedger';
import { IGeneralLedgerSheetQuery } from './GeneralLedger.types';

const query: IGeneralLedgerSheetQuery = {
  fromDate: '2026-01-01',
  toDate: '2026-01-31',
  basis: 'cash',
  numberFormat: {
    precision: 2,
    divideOn1000: false,
    showZero: false,
    formatMoney: 'always',
    negativeFormat: 'mines',
  },
  noneTransactions: false,
  accountsIds: [],
};

const account = {
  id: 1,
  name: 'Accounts Receivable',
  code: '1100',
  index: 1,
  parentAccountId: null,
  accountNormal: 'debit',
};

const openingBalanceEntry = (): ILedgerEntry => ({
  id: 1,
  credit: 0,
  debit: 1000,
  currencyCode: 'USD',
  exchangeRate: 1,
  accountId: 1,
  accountNormal: 'debit',
  contactId: null,
  date: '2025-12-31',
  transactionType: 'OpeningBalance',
  transactionId: 1,
  transactionNumber: 'OPEN-1',
  index: 1,
});

const transactionEntry = (overrides: Partial<ILedgerEntry>): ILedgerEntry => ({
  id: 1,
  credit: 0,
  debit: 0,
  currencyCode: 'USD',
  exchangeRate: 1,
  accountId: 1,
  accountNormal: 'debit',
  contactId: null,
  date: '2026-01-01',
  transactionType: 'Journal',
  transactionSubType: 'general',
  transactionId: 1,
  transactionNumber: 'JV-1',
  index: 1,
  ...overrides,
});

const buildReport = (transactions: ILedgerEntry[]) => {
  const repository = {
    accounts: [account],
    accountsGraph: {
      dependenciesOf: () => [],
      dependantsOf: () => [],
    },
    transactionsLedger: new Ledger(transactions),
    openingBalanceTransactionsLedger: new Ledger([openingBalanceEntry()]),
    contactsById: new Map(),
    accountNodesIncludeTransactions: [],
    accountNodeInclude: [],
  } as unknown as GeneralLedgerRepository;

  const i18n = { t: (key: string) => key } as unknown as I18nService;

  return new GeneralLedgerSheet(query, repository, i18n, {
    baseCurrency: 'USD',
    dateFormat: 'YYYY MMM DD',
  }).reportData();
};

describe('GeneralLedgerSheet', () => {
  it('keeps the running balance after it legitimately hits zero', () => {
    const report = buildReport([
      transactionEntry({ id: 1, credit: 400 }),
      transactionEntry({ id: 2, credit: 600 }),
      transactionEntry({ id: 3, debit: 250 }),
    ]);
    const [accountNode] = report;
    const runningBalances = accountNode.transactions.map(
      (transaction) => transaction.runningBalance,
    );

    expect(accountNode.openingBalance.amount).toBe(1000);
    expect(runningBalances).toEqual([600, 0, 250]);
  });

  it('aligns the last running balance with the closing balance', () => {
    const report = buildReport([
      transactionEntry({ id: 1, credit: 400 }),
      transactionEntry({ id: 2, credit: 600 }),
      transactionEntry({ id: 3, debit: 250 }),
    ]);
    const [accountNode] = report;

    expect(last(accountNode.transactions)?.runningBalance).toBe(
      accountNode.closingBalance.amount,
    );
  });
});
