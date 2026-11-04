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
  const service = new PlaidUpdateTransactions(
    plaidSync as any,
    {} as any,
    plaidItemModel as any,
    plaidClient as any,
  );
  return { service, plaidSync, forUpdate };
};

describe('PlaidUpdateTransactions', () => {
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
