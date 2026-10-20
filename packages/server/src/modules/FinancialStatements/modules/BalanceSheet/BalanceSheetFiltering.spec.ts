import { Ledger } from '@/modules/Ledger/Ledger';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { BalanceSheetFiltering } from './BalanceSheetFiltering';
import {
  BALANCE_SHEET_NODE_TYPE,
  IBalanceSheetDataNode,
} from './BalanceSheet.types';

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
  id: number | string,
  total: number,
  nodeType: BALANCE_SHEET_NODE_TYPE,
  children?: any[],
) =>
  ({
    id,
    name: `Node ${id}`,
    nodeType,
    total: { amount: total, formattedAmount: `${total}`, currencyCode: 'USD' },
    ...(children ? { children } : {}),
  }) as unknown as IBalanceSheetDataNode;

const buildRepository = (
  periodLedgerEntries?: ILedgerEntry[],
  totalLedgerEntries?: ILedgerEntry[],
) =>
  ({
    getAccountsIdsIncludingChildren: (id: number) => (id === 1 ? [2, 1] : [id]),
    ...(periodLedgerEntries
      ? { periodsAccountsLedger: new Ledger(periodLedgerEntries) }
      : {}),
    totalAccountsLedger: new Ledger(totalLedgerEntries),
  }) as any;

const runReportFilterPlugin = (
  filter: { noneTransactions?: boolean; noneZero?: boolean },
  repository,
  nodes: IBalanceSheetDataNode[],
) => {
  const Sheet = BalanceSheetFiltering(class {} as any);
  const sheet = new Sheet() as any;

  sheet.query = { noneTransactions: false, noneZero: false, ...filter };
  sheet.repository = repository;
  sheet.getSchemaNodeById = () => ({});

  return sheet.reportFilterPlugin(nodes) as IBalanceSheetDataNode[];
};

const collectedIds = (nodes, acc: Array<string | number> = []) => {
  nodes.forEach((node) => {
    acc.push(node.id);
    if (node.children) collectedIds(node.children, acc);
  });
  return acc;
};

const totalLedgerEntries = () => [
  ledgerEntry({ id: 1, accountId: 1, debit: 100 }),
  ledgerEntry({ id: 2, accountId: 2, credit: 100 }),
  ledgerEntry({ id: 3, accountId: 4, debit: 500 }),
];

describe('BalanceSheetFiltering', () => {
  describe('nested accounts (parent aggregated with its child)', () => {
    // Account #1 aggregates child account #2. All of them had transactions
    // within the period but their combined total nets to zero. Account #3
    // has no transactions within the period. Account #4 has a non-zero
    // total.
    const buildNestedNodes = () => [
      reportNode('AGGREGATE', 600, BALANCE_SHEET_NODE_TYPE.AGGREGATE, [
        reportNode(10, 600, BALANCE_SHEET_NODE_TYPE.ACCOUNTS, [
          reportNode(1, 0, BALANCE_SHEET_NODE_TYPE.ACCOUNT, [
            reportNode(2, 100, BALANCE_SHEET_NODE_TYPE.ACCOUNT),
          ]),
          reportNode(3, 0, BALANCE_SHEET_NODE_TYPE.ACCOUNT),
          reportNode(4, 500, BALANCE_SHEET_NODE_TYPE.ACCOUNT),
        ]),
      ]),
    ];

    const repository = buildRepository(
      totalLedgerEntries(),
      totalLedgerEntries(),
    );

    it('keeps zero-total accounts that have transactions when the none-transactions filter applied', () => {
      const nodes = runReportFilterPlugin(
        { noneTransactions: true, noneZero: false },
        repository,
        buildNestedNodes(),
      );
      const ids = collectedIds(nodes);

      expect(ids).toContain(1); // Zero total, has transactions in the period.
      expect(ids).toContain(2); // Non-zero child still visible.
      expect(ids).toContain(4); // Non-zero total.
      expect(ids).not.toContain(3); // No transactions in the period.
    });

    it('keeps a zero-total parent account as parent of its surviving children when the none-zero filter applied', () => {
      const nodes = runReportFilterPlugin(
        { noneTransactions: false, noneZero: true },
        repository,
        buildNestedNodes(),
      );
      const ids = collectedIds(nodes);

      // The parent remains as the container of its non-zero child.
      expect(ids).toContain(1);
      expect(ids).toContain(2);
      expect(ids).not.toContain(3);
      expect(ids).toContain(4);
    });

    it('keeps all the nodes when none of the filters applied', () => {
      const nodes = runReportFilterPlugin({}, repository, buildNestedNodes());
      const ids = collectedIds(nodes);

      expect(ids).toEqual(['AGGREGATE', 10, 1, 2, 3, 4]);
    });

    it('falls back to the total ledger when the period-range ledger is not initialized', () => {
      const fallbackRepository = buildRepository(undefined, [
        ledgerEntry({ id: 1, accountId: 1, debit: 100 }),
        ledgerEntry({ id: 3, accountId: 4, debit: 500 }),
      ]);
      const nodes = runReportFilterPlugin(
        { noneTransactions: true, noneZero: false },
        fallbackRepository,
        buildNestedNodes(),
      );
      const ids = collectedIds(nodes);

      expect(ids).toContain(1);
      expect(ids).not.toContain(3);
      expect(ids).toContain(4);
    });

    it('prunes the account groups once all their children filtered out', () => {
      // Account #4 is the only child of the group `40`, with no transactions
      // in the period, which prunes the whole group. Note the total ledger
      // of other accounts keeps the report from being wiped out.
      const nodes = runReportFilterPlugin(
        { noneTransactions: true, noneZero: false },
        buildRepository(
          [],
          [ledgerEntry({ id: 9, accountId: 99, debit: 300 })],
        ),
        [
          reportNode('AGGREGATE', 500, BALANCE_SHEET_NODE_TYPE.AGGREGATE, [
            reportNode(40, 500, BALANCE_SHEET_NODE_TYPE.ACCOUNTS, [
              reportNode(4, 500, BALANCE_SHEET_NODE_TYPE.ACCOUNT),
            ]),
          ]),
        ],
      );
      const ids = collectedIds(nodes);

      expect(ids).toEqual([]);
    });
  });

  describe('flat leaf accounts', () => {
    // Accounts #1 and #3 are leaves with zero totals, account #3 has no
    // transactions in the period, account #4 has a non-zero total.
    const buildFlatNodes = () => [
      reportNode('AGGREGATE', 500, BALANCE_SHEET_NODE_TYPE.AGGREGATE, [
        reportNode(10, 500, BALANCE_SHEET_NODE_TYPE.ACCOUNTS, [
          reportNode(1, 0, BALANCE_SHEET_NODE_TYPE.ACCOUNT),
          reportNode(3, 0, BALANCE_SHEET_NODE_TYPE.ACCOUNT),
          reportNode(4, 500, BALANCE_SHEET_NODE_TYPE.ACCOUNT),
        ]),
      ]),
    ];

    const repository = buildRepository(
      totalLedgerEntries(),
      totalLedgerEntries(),
    );

    it('excludes zero-total leaf accounts when the none-zero filter applied', () => {
      const nodes = runReportFilterPlugin(
        { noneTransactions: false, noneZero: true },
        repository,
        buildFlatNodes(),
      );
      const ids = collectedIds(nodes);

      expect(ids).toEqual(['AGGREGATE', 10, 4]);
    });

    it('excludes accounts with no transactions and zero totals when both filters applied', () => {
      const nodes = runReportFilterPlugin(
        { noneTransactions: true, noneZero: true },
        repository,
        buildFlatNodes(),
      );
      const ids = collectedIds(nodes);

      expect(ids).toEqual(['AGGREGATE', 10, 4]);
    });
  });
});
