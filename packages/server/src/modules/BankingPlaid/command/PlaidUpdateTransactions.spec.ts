import { PlaidUpdateTransactions } from './PlaidUpdateTransactions';

const plaidTransaction = (transactionId: string, accountId: string) =>
  ({ transaction_id: transactionId, account_id: accountId }) as any;

const buildService = (disconnectedPlaidAccountIds?: string[] | null) => {
  const plaidItem = {
    plaidAccessToken: 'access-token',
    lastCursor: null,
    isPaused: false,
    disconnectedPlaidAccountIds,
  };
  const plaidItemModel = () => ({
    query: () => ({
      findOne: () => ({ forUpdate: () => Promise.resolve(plaidItem) }),
    }),
  });
  const plaidClient = {
    transactionsSync: jest.fn().mockResolvedValue({
      data: {
        added: [
          plaidTransaction('tx-1', 'plaid-checking'),
          plaidTransaction('tx-2', 'plaid-savings'),
        ],
        modified: [plaidTransaction('tx-3', 'plaid-savings')],
        removed: [],
        has_more: false,
        next_cursor: 'cursor-1',
      },
    }),
    accountsGet: jest.fn().mockResolvedValue({
      data: {
        accounts: [
          { account_id: 'plaid-checking' },
          { account_id: 'plaid-savings' },
        ],
        item: { item_id: 'item-1', institution_id: 'ins-1' },
      },
    }),
    institutionsGetById: jest
      .fn()
      .mockResolvedValue({ data: { institution: { name: 'Bank' } } }),
  };
  const plaidSync = {
    syncBankAccounts: jest.fn().mockResolvedValue(undefined),
    syncRemoveTransactions: jest.fn().mockResolvedValue(undefined),
    syncAccountsTransactions: jest.fn().mockResolvedValue(undefined),
    syncTransactionsCursor: jest.fn().mockResolvedValue(undefined),
    updateLastFeedsUpdatedAt: jest.fn().mockResolvedValue(undefined),
    updateAccountsFeedsActive: jest.fn().mockResolvedValue(undefined),
    updateAccountsBankBalance: jest.fn().mockResolvedValue(undefined),
  };
  const service = new PlaidUpdateTransactions(
    plaidSync as any,
    {} as any,
    plaidItemModel as any,
    plaidClient as any,
  );
  return { service, plaidSync };
};

describe('PlaidUpdateTransactions', () => {
  it('leaves the disconnected Plaid accounts out of the sync', async () => {
    const { service, plaidSync } = buildService(['plaid-savings']);

    await service.updateTransactionsWork('item-1', 'trx' as any);

    expect(plaidSync.syncBankAccounts).toHaveBeenCalledWith(
      [{ account_id: 'plaid-checking' }],
      { name: 'Bank' },
      { item_id: 'item-1', institution_id: 'ins-1' },
      'trx',
    );
    expect(plaidSync.syncAccountsTransactions).toHaveBeenCalledWith(
      [plaidTransaction('tx-1', 'plaid-checking')],
      'trx',
    );
    expect(plaidSync.updateAccountsFeedsActive).toHaveBeenCalledWith(
      ['plaid-checking'],
      true,
      'trx',
    );
  });

  it('syncs every Plaid account when none is disconnected', async () => {
    const { service, plaidSync } = buildService(null);

    await service.updateTransactionsWork('item-1', 'trx' as any);

    expect(plaidSync.syncBankAccounts.mock.calls[0][0]).toHaveLength(2);
    expect(plaidSync.syncAccountsTransactions.mock.calls[0][0]).toHaveLength(3);
  });
});
