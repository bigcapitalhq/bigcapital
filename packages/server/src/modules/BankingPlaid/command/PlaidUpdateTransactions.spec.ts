import { CountryCode } from 'plaid';
import { PlaidUpdateTransactions } from './PlaidUpdateTransactions';

const transaction = (transactionId: string) =>
  ({ transaction_id: transactionId, account_id: 'plaid-checking' }) as any;

const createService = (syncResponse: any) => {
  const plaidSync = {
    syncBankAccounts: jest.fn(() => Promise.resolve()),
    syncRemoveTransactions: jest.fn(() => Promise.resolve()),
    syncAccountsTransactions: jest.fn(() => Promise.resolve()),
    syncTransactionsCursor: jest.fn(() => Promise.resolve()),
    updateLastFeedsUpdatedAt: jest.fn(() => Promise.resolve()),
    updateAccountsFeedsActive: jest.fn(() => Promise.resolve()),
    updateAccountsBankBalance: jest.fn(() => Promise.resolve()),
  };
  const plaidItem = {
    plaidItemId: 'item-1',
    plaidAccessToken: 'access-token',
    lastCursor: 'cursor-1',
    isPaused: false,
  };
  const forUpdate = jest.fn(() => Promise.resolve(plaidItem));
  const plaidItemModel = () => ({
    query: () => ({ findOne: () => ({ forUpdate }) }),
  });
  const plaidClient = {
    transactionsSync: jest.fn(() =>
      Promise.resolve({
        data: { has_more: false, next_cursor: 'cursor-2', ...syncResponse },
      }),
    ),
    accountsGet: jest.fn(() =>
      Promise.resolve({
        data: { accounts: [], item: { institution_id: 'ins_1' } },
      }),
    ),
    institutionsGetById: jest.fn(() =>
      Promise.resolve({ data: { institution: { name: 'Bank' } } }),
    ),
  };
  const configService = {
    get: jest.fn(() => [CountryCode.Us]),
  };
  const service = new PlaidUpdateTransactions(
    plaidSync as any,
    {} as any,
    plaidItemModel as any,
    plaidClient as any,
    configService as any,
  );
  return { service, plaidSync, forUpdate };
};

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

  it('syncs added and modified transactions under the Plaid item lock', async () => {
    const { service, plaidSync, forUpdate } = createService({
      added: [transaction('tx-1')],
      modified: [transaction('tx-2')],
      removed: [],
    });

    await service.updateTransactionsWork('item-1');

    expect(forUpdate).toHaveBeenCalled();
    expect(plaidSync.syncAccountsTransactions).toHaveBeenCalledWith(
      [transaction('tx-1'), transaction('tx-2')],
      undefined,
    );
    expect(plaidSync.syncTransactionsCursor).toHaveBeenCalledWith(
      'item-1',
      'cursor-2',
      undefined,
    );
  });

  it('keeps a transaction removed in the same update deleted', async () => {
    const { service, plaidSync } = createService({
      added: [transaction('tx-1'), transaction('tx-2')],
      modified: [transaction('tx-3')],
      removed: [{ transaction_id: 'tx-2' }, { transaction_id: 'tx-3' }],
    });

    await service.updateTransactionsWork('item-1');

    expect(plaidSync.syncRemoveTransactions).toHaveBeenCalledWith(
      ['tx-2', 'tx-3'],
      undefined,
    );
    expect(plaidSync.syncAccountsTransactions).toHaveBeenCalledWith(
      [transaction('tx-1')],
      undefined,
    );
  });
});
