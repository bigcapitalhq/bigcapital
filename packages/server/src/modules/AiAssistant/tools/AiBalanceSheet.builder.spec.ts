import { AccountingBasis } from '@/common/types/AccountingBasis';
import { ACCOUNT_TYPE, ACCOUNT_TYPES } from '@/constants/accounts';
import {
  BALANCE_SHEET_GROUP_BY_ACCOUNT_TYPE,
  BALANCE_SHEET_GROUPS,
  balanceSheetOutputSchema,
  type BalanceSheetGroupId,
} from './AiBalanceSheet.schema';
import { BALANCE_SHEET_SCHEMA_NODE_TYPE } from '@/modules/FinancialStatements/modules/BalanceSheet/BalanceSheet.types';
import {
  buildBalanceSheet,
  type IBalanceSheetAccountBalanceRow,
  type IBalanceSheetResolvedFilters,
} from './AiBalanceSheet.builder';
import { getBalanceSheetSchema } from '@/modules/FinancialStatements/modules/BalanceSheet/BalanceSheetSchema';

const account = (
  id: number,
  name: string,
  accountType: string,
  parentAccountId: number | null,
  credit: number,
  debit: number,
  code: string | null = null,
): IBalanceSheetAccountBalanceRow => ({
  id,
  code,
  name,
  accountType,
  parentAccountId,
  index: id,
  credit,
  debit,
});

const currentRows: IBalanceSheetAccountBalanceRow[] = [
  account(1, 'Cash', ACCOUNT_TYPE.CASH, null, 0, 1000),
  account(2, 'Bank', ACCOUNT_TYPE.BANK, 1, 200, 850),
  account(7, 'Petty Cash', ACCOUNT_TYPE.CASH, null, 0, 0),
  account(
    3,
    'Accounts Receivable',
    ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE,
    null,
    100,
    700,
  ),
  account(4, 'Inventory', ACCOUNT_TYPE.INVENTORY, null, 0, 400),
  account(5, 'Equipment', ACCOUNT_TYPE.FIXED_ASSET, null, 50, 1200),
  account(6, 'Accumulated Depreciation', ACCOUNT_TYPE.FIXED_ASSET, 5, 200, 0),
  account(
    10,
    'Accounts Payable',
    ACCOUNT_TYPE.ACCOUNTS_PAYABLE,
    null,
    800,
    100,
  ),
  account(
    11,
    'Long-term Loan',
    ACCOUNT_TYPE.LOGN_TERM_LIABILITY,
    null,
    1500,
    0,
  ),
  account(20, "Owner's Equity", ACCOUNT_TYPE.EQUITY, null, 500, 0),
  account(21, 'Retained Earnings', ACCOUNT_TYPE.EQUITY, null, 300, 0),
  account(30, 'Sales', ACCOUNT_TYPE.INCOME, null, 1500, 0),
  account(31, 'Service Income', ACCOUNT_TYPE.OTHER_INCOME, null, 300, 0),
  account(
    32,
    'Cost of Goods Sold',
    ACCOUNT_TYPE.COST_OF_GOODS_SOLD,
    null,
    0,
    400,
  ),
  account(33, 'Rent', ACCOUNT_TYPE.EXPENSE, null, 0, 700),
  account(34, 'Other Expense', ACCOUNT_TYPE.OTHER_EXPENSE, null, 0, 100),
];

const previousRows: IBalanceSheetAccountBalanceRow[] = [
  account(1, 'Cash', ACCOUNT_TYPE.CASH, null, 0, 800),
  account(2, 'Bank', ACCOUNT_TYPE.BANK, 1, 100, 500),
  account(7, 'Petty Cash', ACCOUNT_TYPE.CASH, null, 0, 0),
  account(
    3,
    'Accounts Receivable',
    ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE,
    null,
    50,
    500,
  ),
  account(4, 'Inventory', ACCOUNT_TYPE.INVENTORY, null, 0, 550),
  account(5, 'Equipment', ACCOUNT_TYPE.FIXED_ASSET, null, 0, 1000),
  account(6, 'Accumulated Depreciation', ACCOUNT_TYPE.FIXED_ASSET, 5, 100, 0),
  account(10, 'Accounts Payable', ACCOUNT_TYPE.ACCOUNTS_PAYABLE, null, 600, 50),
  account(
    11,
    'Long-term Loan',
    ACCOUNT_TYPE.LOGN_TERM_LIABILITY,
    null,
    1200,
    0,
  ),
  account(20, "Owner's Equity", ACCOUNT_TYPE.EQUITY, null, 500, 0),
  account(21, 'Retained Earnings', ACCOUNT_TYPE.EQUITY, null, 300, 0),
  account(30, 'Sales', ACCOUNT_TYPE.INCOME, null, 1200, 0),
  account(31, 'Service Income', ACCOUNT_TYPE.OTHER_INCOME, null, 200, 0),
  account(
    32,
    'Cost of Goods Sold',
    ACCOUNT_TYPE.COST_OF_GOODS_SOLD,
    null,
    0,
    300,
  ),
  account(33, 'Rent', ACCOUNT_TYPE.EXPENSE, null, 0, 500),
  account(34, 'Other Expense', ACCOUNT_TYPE.OTHER_EXPENSE, null, 0, 50),
];

const defaultFilters = (
  overrides: Partial<IBalanceSheetResolvedFilters> = {},
): IBalanceSheetResolvedFilters => ({
  sections: null,
  groupIds: null,
  accountIds: null,
  accountQuery: null,
  focusAccountIds: null,
  includeAccounts: true,
  includeZeroBalances: false,
  maxAccountsPerGroup: 8,
  ...overrides,
});

const build = (
  overrides: Partial<IBalanceSheetResolvedFilters> = {},
  options: {
    rows?: IBalanceSheetAccountBalanceRow[];
    comparison?: boolean;
  } = {},
) =>
  buildBalanceSheet({
    asOfDate: '2025-12-31',
    basis: AccountingBasis.Accrual,
    currency: 'USD',
    rows: options.rows ?? currentRows,
    comparison: options.comparison
      ? {
          asOfDate: '2024-12-31',
          mode: 'previous-year',
          rows: previousRows,
        }
      : undefined,
    filters: defaultFilters(overrides),
  });

const findGroup = (result: ReturnType<typeof build>, id: BalanceSheetGroupId) =>
  result.sections
    .flatMap((section) => section.groups)
    .find((group) => group.id === id);

const findSection = (
  result: ReturnType<typeof build>,
  id: 'assets' | 'liabilities' | 'equity',
) => result.sections.find((section) => section.id === id);

describe('buildBalanceSheet', () => {
  it('builds balanced totals and canonical group totals', () => {
    const result = build();

    expect(result.found).toBe(true);
    expect(result.totals).toMatchObject({
      assets: 3600,
      liabilities: 2200,
      equity: 1400,
      liabilitiesAndEquity: 3600,
      difference: 0,
      isBalanced: true,
    });

    expect(findGroup(result, 'cash-and-cash-equivalents')?.total).toBe(1650);
    expect(findGroup(result, 'accounts-receivable')?.total).toBe(600);
    expect(findGroup(result, 'inventory')?.total).toBe(400);
    expect(findGroup(result, 'fixed-assets')?.total).toBe(950);
    expect(findGroup(result, 'current-liabilities')?.total).toBe(700);
    expect(findGroup(result, 'long-term-liabilities')?.total).toBe(1500);
    expect(findGroup(result, 'equity')?.total).toBe(800);
    expect(findGroup(result, 'net-income')?.total).toBe(600);

    expect(findGroup(result, 'net-income')?.netIncomeBreakdown).toEqual({
      income: 1800,
      expenses: 1200,
      netIncome: 600,
    });

    expect(findSection(result, 'assets')?.total).toBe(3600);
    expect(findSection(result, 'liabilities')?.total).toBe(2200);
    expect(findSection(result, 'equity')?.total).toBe(1400);

    expect(balanceSheetOutputSchema.parse(result)).toEqual(result);
  });

  it('rolls child balances into parents while exposing own balances', () => {
    const result = build();
    const cashGroup = findGroup(result, 'cash-and-cash-equivalents');
    const cashAccount = cashGroup?.accounts.find((row) => row.id === 1);
    const bankAccount = cashGroup?.accounts.find((row) => row.id === 2);

    expect(cashAccount).toMatchObject({
      name: 'Cash',
      parentId: null,
      depth: 0,
      hasChildren: true,
      ownBalance: 1000,
      balance: 1650,
      percentageOfGroup: 100,
    });
    expect(bankAccount).toMatchObject({
      name: 'Bank',
      parentId: 1,
      depth: 1,
      hasChildren: false,
      ownBalance: 650,
      balance: 650,
    });
  });

  it('applies section and group filters without changing totals', () => {
    const result = build({
      sections: ['assets'],
      groupIds: ['current-assets'],
    });

    expect(result.sections).toHaveLength(1);
    expect(result.sections[0].id).toBe('assets');
    expect(result.sections[0].groups.map((group) => group.id)).toEqual([
      'cash-and-cash-equivalents',
      'accounts-receivable',
      'inventory',
      'other-current-assets',
    ]);
    expect(result.sections[0].total).toBe(3600);
    expect(result.totals.assets).toBe(3600);
    expect(
      findGroup(result, 'cash-and-cash-equivalents')?.percentageOfSection,
    ).toBe(45.83);
    expect(result.notes).toContain(
      'Section/group filters only limit displayed groups; section totals, percentages, and overall totals include the full balance sheet.',
    );
  });

  it('focuses account rows on the matched account and descendants', () => {
    const result = build({ focusAccountIds: [1] });
    const cashGroup = findGroup(result, 'cash-and-cash-equivalents');

    expect(result.appliedFilters.resolvedAccountIds).toEqual([1]);
    expect(cashGroup?.accountCount).toBe(2);
    expect(cashGroup?.accounts.map((row) => row.id).sort()).toEqual([1, 2]);

    const otherGroup = findGroup(result, 'accounts-receivable');
    expect(otherGroup?.accounts).toEqual([]);
    expect(otherGroup?.total).toBe(600);
  });

  it('keeps the largest accounts and reports truncation', () => {
    const result = build({ maxAccountsPerGroup: 1 });
    const cashGroup = findGroup(result, 'cash-and-cash-equivalents');

    expect(cashGroup?.accountsReturned).toBe(1);
    expect(cashGroup?.accountsTruncated).toBe(true);
    expect(cashGroup?.accounts[0].id).toBe(1);
  });

  it('always includes a directly focused account even when it is zero', () => {
    const result = build({
      focusAccountIds: [7],
      maxAccountsPerGroup: 1,
    });
    const cashGroup = findGroup(result, 'cash-and-cash-equivalents');

    expect(cashGroup?.accounts.map((row) => row.id)).toEqual([7]);
    expect(cashGroup?.accounts[0]).toMatchObject({
      ownBalance: 0,
      balance: 0,
    });
  });

  it('excludes zero-balance accounts unless requested', () => {
    const withoutZero = build();
    expect(
      findGroup(withoutZero, 'cash-and-cash-equivalents')?.accounts.map(
        (row) => row.id,
      ),
    ).not.toContain(7);

    const withZero = build({ includeZeroBalances: true });
    expect(
      findGroup(withZero, 'cash-and-cash-equivalents')?.accounts.map(
        (row) => row.id,
      ),
    ).toContain(7);
  });

  it('calculates comparison totals, group changes, and account changes', () => {
    const result = build({}, { comparison: true });
    const cashGroup = findGroup(result, 'cash-and-cash-equivalents');
    const bankAccount = cashGroup?.accounts.find((row) => row.id === 2);

    expect(result.comparison).toEqual({
      asOfDate: '2024-12-31',
      mode: 'previous-year',
    });
    expect(result.totals.comparison).toMatchObject({
      asOfDate: '2024-12-31',
      assets: 3100,
      liabilities: 1750,
      equity: 1350,
      liabilitiesAndEquity: 3100,
      difference: 0,
      isBalanced: true,
      changes: {
        assets: 500,
        liabilities: 450,
        equity: 50,
        liabilitiesAndEquity: 500,
      },
      percentageChanges: {
        assets: 16.13,
        liabilities: 25.71,
        equity: 3.7,
        liabilitiesAndEquity: 16.13,
      },
    });
    expect(cashGroup?.comparison).toMatchObject({
      previousBalance: 1200,
      change: 450,
      changePercentage: 37.5,
    });
    expect(bankAccount?.comparison).toMatchObject({
      previousBalance: 400,
      change: 250,
      changePercentage: 62.5,
    });
  });

  it('returns null percentage changes when the prior balance is zero', () => {
    const rowsWithoutBank = previousRows.map((row) =>
      row.id === 2 ? { ...row, credit: 0, debit: 0 } : row,
    );
    const result = buildBalanceSheet({
      asOfDate: '2025-12-31',
      basis: AccountingBasis.Accrual,
      currency: 'USD',
      rows: currentRows,
      comparison: {
        asOfDate: '2024-12-31',
        mode: 'previous-year',
        rows: rowsWithoutBank,
      },
      filters: defaultFilters(),
    });
    const bankAccount = findGroup(
      result,
      'cash-and-cash-equivalents',
    )?.accounts.find((row) => row.id === 2);

    expect(bankAccount?.comparison?.previousBalance).toBe(0);
    expect(bankAccount?.comparison?.changePercentage).toBeNull();
  });

  it('reports an unbalanced balance sheet', () => {
    const rows = currentRows.map((row) =>
      row.id === 4 ? { ...row, debit: 900 } : row,
    );
    const result = build({}, { rows });

    expect(result.totals.difference).toBe(500);
    expect(result.totals.isBalanced).toBe(false);
    expect(result.notes).toContain(
      'The balance sheet does not balance: assets differ from liabilities plus equity by 500.',
    );
  });

  it('covers every account node in the canonical balance sheet schema', () => {
    const schemaNodeIds = new Set(
      BALANCE_SHEET_GROUPS.map((group) => group.schemaNodeId),
    );
    const walk = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (node.type === BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS) {
          expect(schemaNodeIds.has(node.id)).toBe(true);
          node.accountsTypes.forEach((accountType: string) => {
            expect(BALANCE_SHEET_GROUP_BY_ACCOUNT_TYPE.has(accountType)).toBe(
              true,
            );
          });
        }
        if (Array.isArray(node.children)) {
          walk(node.children);
        }
      });
    };

    walk(getBalanceSheetSchema());
  });

  it('maps every configured account type to exactly one group', () => {
    ACCOUNT_TYPES.forEach((accountType) => {
      expect(BALANCE_SHEET_GROUP_BY_ACCOUNT_TYPE.has(accountType.key)).toBe(
        true,
      );
    });

    const groupedTypes = BALANCE_SHEET_GROUPS.flatMap(
      (group) => group.accountTypes,
    );
    expect(new Set(groupedTypes).size).toBe(groupedTypes.length);
  });
});
