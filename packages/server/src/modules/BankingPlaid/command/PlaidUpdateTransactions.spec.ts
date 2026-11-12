import { CountryCode } from 'plaid';
import { PlaidUpdateTransactions } from './PlaidUpdateTransactions';

describe('PlaidUpdateTransactions', () => {
  it('uses configured country codes for institution lookup', async () => {
    const plaidItemModel = (() => ({
      query: () => ({
        findOne: () => ({
          forUpdate: () =>
            Promise.resolve({
              plaidItemId: 'item-id',
              isPaused: false,
              plaidAccessToken: 'access-token',
              lastCursor: 'cursor',
            }),
        }),
      }),
    })) as any;
    const plaidSync = {
      syncBankAccounts: jest.fn().mockResolvedValue(undefined),
      syncRemoveTransactions: jest.fn().mockResolvedValue(undefined),
      syncAccountsTransactions: jest.fn().mockResolvedValue(undefined),
      syncTransactionsCursor: jest.fn().mockResolvedValue(undefined),
      updateLastFeedsUpdatedAt: jest.fn().mockResolvedValue(undefined),
      updateAccountsFeedsActive: jest.fn().mockResolvedValue(undefined),
      updateAccountsBankBalance: jest.fn().mockResolvedValue(undefined),
    };
    const plaidClient = {
      transactionsSync: jest.fn().mockResolvedValue({
        data: {
          added: [],
          modified: [],
          removed: [],
          has_more: false,
          next_cursor: 'next-cursor',
        },
      }),
      accountsGet: jest.fn().mockResolvedValue({
        data: { accounts: [], item: { institution_id: 'ins_1' } },
      }),
      institutionsGetById: jest
        .fn()
        .mockResolvedValue({ data: { institution: {} } }),
    };
    const configService = {
      get: jest.fn((key: string) =>
        key === 'plaid.countryCodes'
          ? [CountryCode.Us, CountryCode.Ca]
          : undefined,
      ),
    };
    const service = new PlaidUpdateTransactions(
      plaidSync as any,
      {} as any,
      plaidItemModel,
      plaidClient as any,
      configService as any,
    );

    await service.updateTransactionsWork('item-id');

    expect(plaidClient.institutionsGetById).toHaveBeenCalledWith({
      institution_id: 'ins_1',
      country_codes: [CountryCode.Us, CountryCode.Ca],
    });
  });
});
