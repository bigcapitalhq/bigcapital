import {
  aggregateFinancialTotals,
  getSignedAmount,
  getAccountTypeMeta,
} from './LedgerAnalyticsAggregation';
import { IAccountBalanceRow } from '../Analytics.constants';

const row = (overrides: Partial<IAccountBalanceRow>): IAccountBalanceRow => ({
  organizationId: 'org-1',
  accountType: 'bank',
  accountNormal: 'debit',
  active: 1,
  credit: 0,
  debit: 0,
  ...overrides,
});

describe('getSignedAmount', () => {
  it('computes debit-normal signed amount', () => {
    expect(getSignedAmount(20, 100, 'debit')).toBe(80);
  });

  it('computes credit-normal signed amount', () => {
    expect(getSignedAmount(100, 20, 'credit')).toBe(80);
  });
});

describe('getAccountTypeMeta', () => {
  it('resolves the known account types', () => {
    expect(getAccountTypeMeta('bank')).toEqual({
      rootType: 'asset',
      normal: 'debit',
    });
    expect(getAccountTypeMeta('accounts-payable')).toEqual({
      rootType: 'liability',
      normal: 'credit',
    });
  });

  it('returns undefined for unknown account types', () => {
    expect(getAccountTypeMeta('unknown-type')).toBeUndefined();
  });
});

describe('aggregateFinancialTotals', () => {
  it('aggregates total assets and liabilities of a single organization', () => {
    const totals = aggregateFinancialTotals([
      row({ accountType: 'bank', accountNormal: 'debit', debit: 100 }),
      row({ accountType: 'cash', accountNormal: 'debit', debit: 50 }),
      row({
        accountType: 'accounts-payable',
        accountNormal: 'credit',
        credit: 40,
      }),
      row({
        accountType: 'credit-card',
        accountNormal: 'credit',
        credit: 10,
      }),
    ]);

    expect(totals.get('org-1')).toEqual({
      totalAssets: 150,
      totalLiabilities: 50,
    });
  });

  it('excludes inactive accounts', () => {
    const totals = aggregateFinancialTotals([
      row({ accountType: 'bank', debit: 100 }),
      row({ accountType: 'cash', debit: 999, active: 0 }),
    ]);

    expect(totals.get('org-1').totalAssets).toBe(100);
  });

  it('excludes unknown account types', () => {
    const totals = aggregateFinancialTotals([
      row({ accountType: 'bank', debit: 100 }),
      row({ accountType: 'custom-type', debit: 999 }),
    ]);

    expect(totals.get('org-1').totalAssets).toBe(100);
  });

  it('excludes income, expense and equity accounts', () => {
    const totals = aggregateFinancialTotals([
      row({ accountType: 'bank', debit: 100 }),
      row({ accountType: 'income', accountNormal: 'credit', credit: 500 }),
      row({ accountType: 'expense', accountNormal: 'debit', debit: 300 }),
      row({ accountType: 'equity', accountNormal: 'credit', credit: 700 }),
    ]);

    expect(totals.get('org-1')).toEqual({
      totalAssets: 100,
      totalLiabilities: 0,
    });
  });

  it('supports negative balances (overpaid liability)', () => {
    const totals = aggregateFinancialTotals([
      row({
        accountType: 'accounts-payable',
        accountNormal: 'credit',
        debit: 20,
      }),
    ]);

    expect(totals.get('org-1').totalLiabilities).toBe(-20);
  });

  it('separates the totals of multiple organizations', () => {
    const totals = aggregateFinancialTotals([
      row({ organizationId: 'org-1', accountType: 'bank', debit: 100 }),
      row({ organizationId: 'org-2', accountType: 'cash', debit: 30 }),
      row({
        organizationId: 'org-2',
        accountType: 'accounts-payable',
        accountNormal: 'credit',
        credit: 5,
      }),
    ]);

    expect(totals.get('org-1')).toEqual({
      totalAssets: 100,
      totalLiabilities: 0,
    });
    expect(totals.get('org-2')).toEqual({
      totalAssets: 30,
      totalLiabilities: 5,
    });
  });

  it('returns an empty map for empty rows', () => {
    expect(aggregateFinancialTotals([]).size).toBe(0);
  });
});
