import { CashflowAccountTransformer } from './BankAccountTransformer';

const buildAccount = (overrides: any = {}) =>
  ({
    id: 1,
    name: 'Bank of America - Checking',
    amount: 100,
    currencyCode: 'USD',
    lastFeedsUpdatedAt: null,
    uncategorizedTransactions: 0,
    plaidItem: {
      plaidAccessToken: 'secret-access-token',
      plaidInstitutionName: 'Bank of America',
      plaidInstitutionLogo: 'base64-logo',
    },
    ...overrides,
  }) as any;

describe('CashflowAccountTransformer', () => {
  it('exposes the institution logo as a data URL and hides the Plaid item', () => {
    const transformer = new CashflowAccountTransformer();
    const account = transformer.work(buildAccount());

    expect(account.plaidInstitutionName).toBe('Bank of America');
    expect(account.plaidInstitutionLogo).toBe(
      'data:image/png;base64,base64-logo',
    );
    expect(account.plaidItem).toBeUndefined();
    expect(JSON.stringify(account)).not.toContain('secret-access-token');
  });

  it('returns a null logo when the item has no logo', () => {
    const transformer = new CashflowAccountTransformer();
    const account = transformer.work(
      buildAccount({
        plaidItem: { plaidInstitutionName: 'Bank of America' },
      }),
    );

    expect(account.plaidInstitutionLogo).toBeNull();
  });
});
