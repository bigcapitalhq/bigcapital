import { PlaidSyncDb } from './PlaidSyncDB';

const plaidTransaction = (transactionId: string) =>
  ({
    transaction_id: transactionId,
    account_id: 'plaid-checking',
    date: '2026-09-01',
    amount: 25,
    name: `Transaction ${transactionId}`,
    iso_currency_code: 'USD',
    pending: false,
    pending_transaction_id: null,
  }) as any;

const buildSyncDb = (syncedTransactionsIds: string[]) => {
  const whereIn = jest.fn().mockResolvedValue(
    syncedTransactionsIds.map((plaidTransactionId) => ({
      plaidTransactionId,
    })),
  );
  const accountQuery = {
    findOne: jest.fn(() => ({
      throwIfNotFound: jest.fn().mockResolvedValue({ id: 1000 }),
    })),
  };
  const createUncategorizedTransaction = {
    create: jest.fn().mockResolvedValue({}),
  };
  const eventPublisher = { emitAsync: jest.fn().mockResolvedValue([]) };

  const syncDb = new PlaidSyncDb(
    {} as any,
    createUncategorizedTransaction as any,
    {} as any,
    eventPublisher as any,
    (() => ({ query: () => accountQuery })) as any,
    (() => ({})) as any,
    (() => ({ query: () => ({ whereIn }) })) as any,
  );
  return { syncDb, whereIn, createUncategorizedTransaction, eventPublisher };
};

describe('PlaidSyncDb', () => {
  describe('syncAccountTranactions', () => {
    it('creates only the transactions not synced before', async () => {
      const { syncDb, whereIn, createUncategorizedTransaction } = buildSyncDb([
        'tx-1',
      ]);

      await syncDb.syncAccountTranactions(1, [
        plaidTransaction('tx-1'),
        plaidTransaction('tx-2'),
      ]);
      expect(whereIn).toHaveBeenCalledWith('plaidTransactionId', [
        'tx-1',
        'tx-2',
      ]);
      expect(createUncategorizedTransaction.create).toHaveBeenCalledTimes(1);
      expect(createUncategorizedTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          plaidTransactionId: 'tx-2',
          accountId: 1000,
        }),
        undefined,
      );
    });

    it('creates a transaction repeated in the batch once', async () => {
      const { syncDb, createUncategorizedTransaction } = buildSyncDb([]);

      await syncDb.syncAccountTranactions(1, [
        plaidTransaction('tx-3'),
        plaidTransaction('tx-3'),
      ]);
      expect(createUncategorizedTransaction.create).toHaveBeenCalledTimes(1);
    });

    it('still reports the synced batch when nothing is new', async () => {
      const { syncDb, createUncategorizedTransaction, eventPublisher } =
        buildSyncDb(['tx-1']);

      await syncDb.syncAccountTranactions(1, [plaidTransaction('tx-1')]);
      expect(createUncategorizedTransaction.create).not.toHaveBeenCalled();
      expect(eventPublisher.emitAsync).toHaveBeenCalledTimes(1);
    });
  });
});
