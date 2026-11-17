import { AccountingBasis } from '@/common/types/AccountingBasis';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import {
  AiBalanceSheetRepository,
  getFiscalYearStart,
  resolveBalanceSheetComparison,
  type IAiBalanceSheetContext,
} from './AiBalanceSheet.repository';
import type {
  BalanceSheetSuccessOutput,
  BalanceSheetUnresolvedOutput,
} from './AiBalanceSheet.schema';

const expectSuccess = (
  result: BalanceSheetSuccessOutput | BalanceSheetUnresolvedOutput,
): BalanceSheetSuccessOutput => {
  expect(result.found).toBe(true);
  return result as BalanceSheetSuccessOutput;
};

const expectUnresolved = (
  result: BalanceSheetSuccessOutput | BalanceSheetUnresolvedOutput,
): BalanceSheetUnresolvedOutput => {
  expect(result.found).toBe(false);
  return result as BalanceSheetUnresolvedOutput;
};

interface IRawAccountRow {
  id: number;
  code: string | null;
  name: string;
  account_type: string;
  parent_account_id: number | null;
  account_index: number;
  credit: string;
  debit: string;
}

const rawAccount = (
  id: number,
  name: string,
  accountType: string,
  parentAccountId: number | null,
  credit: number,
  debit: number,
  code: string | null = null,
): IRawAccountRow => ({
  id,
  code,
  name,
  account_type: accountType,
  parent_account_id: parentAccountId,
  account_index: id,
  credit: String(credit),
  debit: String(debit),
});

const currentRows: IRawAccountRow[] = [
  rawAccount(1, 'Cash', ACCOUNT_TYPE.CASH, null, 0, 1000),
  rawAccount(2, 'Bank', ACCOUNT_TYPE.BANK, 1, 0, 500),
  rawAccount(
    3,
    'Accounts Receivable',
    ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE,
    null,
    0,
    300,
  ),
  rawAccount(
    4,
    'Accounts Payable',
    ACCOUNT_TYPE.ACCOUNTS_PAYABLE,
    null,
    400,
    0,
  ),
  rawAccount(5, "Owner's Equity", ACCOUNT_TYPE.EQUITY, null, 1300, 0),
  rawAccount(6, 'Sales', ACCOUNT_TYPE.INCOME, null, 200, 0),
  rawAccount(7, 'Rent', ACCOUNT_TYPE.EXPENSE, null, 0, 100),
];

// A balanced prior snapshot: assets 1500, liabilities 300, equity 1200.
const previousRows: IRawAccountRow[] = [
  rawAccount(1, 'Cash', ACCOUNT_TYPE.CASH, null, 0, 900),
  rawAccount(2, 'Bank', ACCOUNT_TYPE.BANK, 1, 0, 400),
  rawAccount(
    3,
    'Accounts Receivable',
    ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE,
    null,
    0,
    200,
  ),
  rawAccount(
    4,
    'Accounts Payable',
    ACCOUNT_TYPE.ACCOUNTS_PAYABLE,
    null,
    300,
    0,
  ),
  rawAccount(5, "Owner's Equity", ACCOUNT_TYPE.EQUITY, null, 1100, 0),
  rawAccount(6, 'Sales', ACCOUNT_TYPE.INCOME, null, 200, 0),
  rawAccount(7, 'Rent', ACCOUNT_TYPE.EXPENSE, null, 0, 100),
];

const context: IAiBalanceSheetContext = {
  baseCurrency: 'USD',
  accountingBasis: AccountingBasis.Accrual,
  fiscalYear: 'January',
};

const createRepository = (
  rows: {
    current?: IRawAccountRow[];
    previous?: IRawAccountRow[];
    previousDate?: string;
  } = {},
) => {
  const current = rows.current ?? currentRows;
  const previous = rows.previous ?? previousRows;
  const previousDate = rows.previousDate ?? '2024-12-31';
  const raw = jest.fn((_sql: string, bindings: any[]) => ({
    timeout: async () => [bindings[0] === previousDate ? previous : current],
  }));

  return new AiBalanceSheetRepository({ raw } as any);
};

describe('AiBalanceSheetRepository', () => {
  it('returns a balanced balance sheet with normalized decimal values', async () => {
    const repository = createRepository();
    const result = await repository.getBalanceSheet({}, context);

    const success = expectSuccess(result);

    expect(success.basis).toBe(AccountingBasis.Accrual);
    expect(success.currency).toBe('USD');
    expect(success.totals).toMatchObject({
      assets: 1800,
      liabilities: 400,
      equity: 1400,
      liabilitiesAndEquity: 1800,
      difference: 0,
      isBalanced: true,
    });
    expect(success.notes).toContain('All amounts are in USD.');
  });

  it('resolves an explicit account name to a focus account', async () => {
    const repository = createRepository();
    const result = await repository.getBalanceSheet(
      { accountQuery: 'cash', includeAccounts: true },
      context,
    );

    const success = expectSuccess(result);
    expect(success.appliedFilters.resolvedAccountIds).toEqual([1]);
    expect(success.appliedFilters.accountQuery).toBe('cash');
  });

  it('returns ambiguous account matches for the assistant to disambiguate', async () => {
    const repository = createRepository();
    const result = await repository.getBalanceSheet(
      { accountQuery: 'acc' },
      context,
    );

    const unresolved = expectUnresolved(result);
    expect(unresolved.reason).toBe('ambiguous');
    expect(unresolved.matches.map((match) => match.id).sort()).toEqual([3, 4]);
    expect(unresolved.message).toContain('Ask the user');
  });

  it('returns not found for unknown accounts with a recovery instruction', async () => {
    const repository = createRepository();
    const result = await repository.getBalanceSheet(
      { accountQuery: 'nonexistent' },
      context,
    );

    const unresolved = expectUnresolved(result);
    expect(unresolved.reason).toBe('not_found');
    expect(unresolved.matches).toEqual([]);
    expect(unresolved.message).toContain('retry with accountQuery omitted');
  });

  it('ignores generic full-report account phrases', async () => {
    const repository = createRepository();
    const result = await repository.getBalanceSheet(
      { accountQuery: 'whole balance' },
      context,
    );

    const success = expectSuccess(result);
    expect(success.appliedFilters.accountQuery).toBeNull();
    expect(success.appliedFilters.ignoredAccountQuery).toBe('whole balance');
    expect(success.notes).toContain(
      'Ignored the account filter "whole balance" because it describes the whole balance sheet. No account focus was applied.',
    );
  });

  it('redirects profit-and-loss accounts to the P&L tools', async () => {
    const repository = createRepository();
    const result = await repository.getBalanceSheet(
      { accountQuery: 'sales' },
      context,
    );

    const unresolved = expectUnresolved(result);
    expect(unresolved.reason).toBe('not_found');
    expect(unresolved.matches[0]).toMatchObject({
      id: 6,
      isBalanceSheetAccount: false,
    });
    expect(unresolved.message).toContain('profit and loss tools');
  });

  it('resolves account IDs and rejects P&L account IDs', async () => {
    const repository = createRepository();

    const resolved = await repository.getBalanceSheet(
      { accountIds: [1] },
      context,
    );
    expect(expectSuccess(resolved).appliedFilters.resolvedAccountIds).toEqual([
      1,
    ]);

    const rejected = await repository.getBalanceSheet(
      { accountIds: [6] },
      context,
    );
    expect(expectUnresolved(rejected).reason).toBe('not_found');
  });

  it('prefers accountIds when both account filters are supplied', async () => {
    const repository = createRepository();
    const result = await repository.getBalanceSheet(
      { accountIds: [1], accountQuery: 'sales' },
      context,
    );

    expect(expectSuccess(result).appliedFilters.resolvedAccountIds).toEqual([
      1,
    ]);
  });

  it('falls back to accountQuery when accountIds do not match', async () => {
    const repository = createRepository();
    const result = await repository.getBalanceSheet(
      { accountIds: [999], accountQuery: 'cash' },
      context,
    );

    expect(expectSuccess(result).appliedFilters.resolvedAccountIds).toEqual([
      1,
    ]);
  });

  it('loads balances for the comparison date', async () => {
    const repository = createRepository();
    const result = await repository.getBalanceSheet(
      {
        asOfDate: '2025-12-31',
        compareToDate: '2024-12-31',
      },
      context,
    );

    const success = expectSuccess(result);
    expect(success.comparison).toEqual({
      asOfDate: '2024-12-31',
      mode: 'compare-to-date',
    });
    expect(success.totals.comparison).toMatchObject({
      assets: 1500,
      liabilities: 300,
      equity: 1200,
      liabilitiesAndEquity: 1500,
      isBalanced: true,
    });
  });
});

describe('balance sheet comparison dates', () => {
  it('resolves previous month and quarter ends', () => {
    expect(
      resolveBalanceSheetComparison(
        { asOfDate: '2025-05-15', compare: 'previous-month' },
        null,
      ),
    ).toEqual({ asOfDate: '2025-04-30', mode: 'previous-month' });

    expect(
      resolveBalanceSheetComparison(
        { asOfDate: '2025-05-15', compare: 'previous-quarter' },
        null,
      ),
    ).toEqual({ asOfDate: '2025-03-31', mode: 'previous-quarter' });
  });

  it('resolves the previous year and an explicit comparison date', () => {
    expect(
      resolveBalanceSheetComparison(
        { asOfDate: '2025-05-15', compare: 'previous-year' },
        null,
      ),
    ).toEqual({ asOfDate: '2024-05-15', mode: 'previous-year' });

    expect(
      resolveBalanceSheetComparison(
        { asOfDate: '2025-05-15', compareToDate: '2024-12-31' },
        null,
      ),
    ).toEqual({ asOfDate: '2024-12-31', mode: 'compare-to-date' });
  });

  it('resolves the equal-length previous period', () => {
    expect(
      resolveBalanceSheetComparison(
        {
          asOfDate: '2025-05-15',
          compare: 'previous-period',
          periodStartDate: '2025-01-01',
        },
        null,
      ),
    ).toEqual({ asOfDate: '2024-12-31', mode: 'previous-period' });
  });

  it('falls back to the organization fiscal year start', () => {
    expect(
      getFiscalYearStart('2025-01-15', 'February').format('YYYY-MM-DD'),
    ).toBe('2024-02-01');
    expect(
      resolveBalanceSheetComparison(
        { asOfDate: '2025-01-15', compare: 'previous-period' },
        'February',
      ),
    ).toEqual({ asOfDate: '2024-01-31', mode: 'previous-period' });
  });

  it('returns null when no comparison is requested', () => {
    expect(
      resolveBalanceSheetComparison({ asOfDate: '2025-05-15' }, null),
    ).toBeNull();
  });
});
