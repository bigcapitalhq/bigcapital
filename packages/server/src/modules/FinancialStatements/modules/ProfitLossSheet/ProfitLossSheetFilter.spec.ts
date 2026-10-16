import { flow } from 'fp-ts/function';
import { Ledger } from '@/modules/Ledger/Ledger';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { FinancialSheet } from '../../common/FinancialSheet';
import { ProfitLossSheetBase } from './ProfitLossSheetBase';
import { ProfitLossSheetFilter } from './ProfitLossSheetFilter';
import {
  IProfitLossSheetNode,
  ProfitLossNodeType,
} from './ProfitLossSheet.types';

const ledgerEntry = (overrides: Partial<ILedgerEntry>): ILedgerEntry => ({
  id: 1,
  credit: 0,
  debit: 0,
  currencyCode: 'USD',
  exchangeRate: 1,
  accountId: 1,
  accountNormal: 'debit',
  contactId: null,
  date: '2026-01-15',
  transactionType: 'Journal',
  transactionSubType: 'general',
  transactionId: 1,
  transactionNumber: 'JV-1',
  index: 1,
  ...overrides,
});

const reportNode = (
  id: number,
  total: number,
  nodeType: ProfitLossNodeType,
  children?: any[],
) =>
  ({
    id,
    name: `Node ${id}`,
    nodeType,
    total: { amount: total, formattedAmount: `${total}`, currencyCode: 'USD' },
    ...(children ? { children } : {}),
  }) as unknown as IProfitLossSheetNode;

// Account #1 had transactions within the period which net to zero.
// Account #2 has no transactions within the period.
// Account #3 has a non-zero total.
const buildNodes = (): IProfitLossSheetNode[] => [
  reportNode(10, 650, ProfitLossNodeType.ACCOUNTS, [
    reportNode(1, 0, ProfitLossNodeType.ACCOUNT),
    reportNode(2, 0, ProfitLossNodeType.ACCOUNT),
    reportNode(3, 650, ProfitLossNodeType.ACCOUNT),
  ]),
];

const buildRepository = (ledgerEntries: ILedgerEntry[]) =>
  ({
    getAccountsIdsIncludingChildren: (id: number | string) => [id],
    totalAccountsLedger: new Ledger(ledgerEntries),
  }) as any;

const runReportFilterPlugin = (
  filter: { noneTransactions?: boolean; noneZero?: boolean },
  repository,
  nodes = buildNodes(),
) => {
  // Mirrors the composition of the real P&L sheet from which the
  // filtering mixin is extend.
  const Sheet = ProfitLossSheetFilter(
    flow(
      FinancialSheetStructure,
      ProfitLossSheetBase,
    )(class extends FinancialSheet {}),
  );
  const sheet = new Sheet() as any;

  sheet.query = { noneTransactions: false, noneZero: false, ...filter };
  sheet.repository = repository;
  sheet.getSchemaNodeById = () => ({});

  return sheet.reportFilterPlugin(nodes) as IProfitLossSheetNode[];
};

const collectedIds = (nodes, acc: Array<string | number> = []) => {
  nodes.forEach((node) => {
    acc.push(node.id);
    if (node.children) collectedIds(node.children, acc);
  });
  return acc;
};

describe('ProfitLossSheetFilter', () => {
  const repository = buildRepository([
    ledgerEntry({ id: 1, accountId: 1, debit: 100 }),
    ledgerEntry({ id: 2, accountId: 1, credit: 100 }),
    ledgerEntry({ id: 3, accountId: 3, debit: 650 }),
  ]);

  it('keeps zero-total accounts that have transactions when the none-transactions filter applied', () => {
    const nodes = runReportFilterPlugin(
      { noneTransactions: true, noneZero: false },
      repository,
    );
    const ids = collectedIds(nodes);

    expect(ids).toContain(1); // Zero total, has transactions in the period.
    expect(ids).toContain(3); // Non-zero total.
    expect(ids).not.toContain(2); // No transactions in the period.
  });

  it('excludes accounts with zero totals when the none-zero filter applied', () => {
    const nodes = runReportFilterPlugin(
      { noneTransactions: false, noneZero: true },
      repository,
    );
    const ids = collectedIds(nodes);

    expect(ids).not.toContain(1); // Zero total regardless of transactions.
    expect(ids).not.toContain(2);
    expect(ids).toContain(3);
  });

  it('excludes accounts with no transactions when both filters applied', () => {
    const nodes = runReportFilterPlugin(
      { noneTransactions: true, noneZero: true },
      repository,
    );
    const ids = collectedIds(nodes);

    expect(ids).not.toContain(1);
    expect(ids).not.toContain(2);
    expect(ids).toContain(3);
  });

  it('keeps all the nodes when none of the filters applied', () => {
    const nodes = runReportFilterPlugin({}, repository);
    const ids = collectedIds(nodes);

    expect(ids).toEqual([10, 1, 2, 3]);
  });

  it('prunes the account groups once all their children filtered out', () => {
    // Account #3 is the only child of the group `20`, with no transactions
    // in the period, which prunes the whole group. The total ledger keeps
    // entries of other accounts to save the report from being wiped out.
    const nodes = runReportFilterPlugin(
      { noneTransactions: true, noneZero: false },
      buildRepository([ledgerEntry({ id: 9, accountId: 99, debit: 300 })]),
      [
        reportNode(20, 500, ProfitLossNodeType.ACCOUNTS, [
          reportNode(3, 500, ProfitLossNodeType.ACCOUNT),
        ]),
      ],
    );
    const ids = collectedIds(nodes);

    expect(ids).toEqual([]);
  });
});
