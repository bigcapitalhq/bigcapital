import {
  balanceSheetInputSchema,
  balanceSheetOutputSchema,
} from './AiBalanceSheet.schema';

describe('AiBalanceSheet schemas', () => {
  it('accepts an empty input and resolves defaults later', () => {
    const result = balanceSheetInputSchema.safeParse({});

    expect(result.success).toBe(true);
    expect(result.data).toEqual({});
  });

  it('accepts the flexible filter set', () => {
    const result = balanceSheetInputSchema.safeParse({
      asOfDate: '2025-12-31',
      compare: 'previous-year',
      basis: 'accrual',
      sections: ['assets', 'liabilities'],
      groupIds: ['current-assets', 'equity'],
      accountQuery: 'cash',
      includeAccounts: true,
      includeZeroBalances: false,
      maxAccountsPerGroup: 10,
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid calendar dates', () => {
    const result = balanceSheetInputSchema.safeParse({
      asOfDate: '2025-02-31',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a comparison date after the as-of date', () => {
    const result = balanceSheetInputSchema.safeParse({
      asOfDate: '2025-01-01',
      compareToDate: '2025-06-30',
    });

    expect(result.success).toBe(false);
  });

  it('accepts both comparison filters and lets compareToDate take precedence', () => {
    const result = balanceSheetInputSchema.safeParse({
      compare: 'previous-year',
      compareToDate: '2024-12-31',
    });

    expect(result.success).toBe(true);
    expect(result.data?.compareToDate).toBe('2024-12-31');
    expect(result.data?.compare).toBe('previous-year');
  });

  it('accepts both account filters and lets accountIds take precedence', () => {
    const result = balanceSheetInputSchema.safeParse({
      accountIds: [1],
      accountQuery: 'cash',
    });

    expect(result.success).toBe(true);
    expect(result.data?.accountIds).toEqual([1]);
    expect(result.data?.accountQuery).toBe('cash');
  });

  it('normalizes the fully-populated shape the model often emits', () => {
    const result = balanceSheetInputSchema.safeParse({
      asOfDate: '2026-11-17',
      compareToDate: '',
      compare: 'previous-year',
      periodStartDate: '',
      basis: 'accrual',
      sections: ['assets', 'liabilities', 'equity'],
      groupIds: [
        'cash-and-cash-equivalents',
        'accounts-receivable',
        'inventory',
        'other-current-assets',
        'fixed-assets',
        'non-current-assets',
        'current-liabilities',
        'long-term-liabilities',
        'non-current-liabilities',
        'equity',
        'net-income',
        'current-assets',
      ],
      accountIds: [1],
      accountQuery: 'x',
      includeAccounts: true,
      includeZeroBalances: false,
      maxAccountsPerGroup: 8,
    });

    expect(result.success).toBe(true);
    expect(result.data?.compareToDate).toBeUndefined();
    expect(result.data?.periodStartDate).toBeUndefined();
    expect(result.data?.compare).toBe('previous-year');
    expect(result.data?.accountIds).toEqual([1]);
    expect(result.data?.accountQuery).toBe('x');
  });

  it('normalizes empty arrays and empty strings', () => {
    const result = balanceSheetInputSchema.safeParse({
      asOfDate: '',
      sections: [],
      groupIds: [],
      accountIds: [],
      accountQuery: '',
      maxAccountsPerGroup: 0,
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({});
  });

  it('parses the unresolved account shape', () => {
    const result = balanceSheetOutputSchema.safeParse({
      found: false,
      reason: 'ambiguous',
      matches: [
        {
          id: 1,
          code: '1000',
          name: 'Cash',
          accountType: 'cash',
          isBalanceSheetAccount: true,
        },
      ],
      message: 'Multiple accounts match.',
    });

    expect(result.success).toBe(true);
  });

  it('parses the safe error shape', () => {
    const result = balanceSheetOutputSchema.safeParse({
      error: 'I could not retrieve that data.',
    });

    expect(result.success).toBe(true);
  });
});
