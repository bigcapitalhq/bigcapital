import { UniqueViolationError } from 'objection';
import { events } from '@/common/events/events';
import { CreateUncategorizedTransactionService } from '@/modules/BankingCategorize/commands/CreateUncategorizedTransaction.service';
import { PlaidSyncDb } from './PlaidSyncDB';

const PLAID_ACCOUNT_ID = 'plaid-checking';
const ACCOUNT_ID = 1000;

const plaidTransaction = (transactionId: string, overrides: any = {}) =>
  ({
    transaction_id: transactionId,
    account_id: PLAID_ACCOUNT_ID,
    date: '2026-11-02',
    amount: 100,
    name: `Transaction ${transactionId}`,
    iso_currency_code: 'USD',
    pending: false,
    pending_transaction_id: null,
    payment_meta: { payee: null, reference_number: null },
    ...overrides,
  }) as any;

/**
 * In-memory stand-in for an objection query builder over one table, enough
 * for the queries the Plaid sync runs.
 */
const createQuery = (table: any[], uniqueColumn?: string) => {
  const filters: Array<(row: any) => boolean> = [];
  let first = false;
  let throwIfNotFound = false;
  const matching = () => table.filter((row) => filters.every((f) => f(row)));

  const builder: any = {
    findOne: (where: Record<string, any>) => {
      filters.push((row) =>
        Object.entries(where).every(([key, value]) => row[key] === value),
      );
      first = true;
      return builder;
    },
    findById: (id: number) => {
      filters.push((row) => row.id === id);
      first = true;
      return builder;
    },
    whereIn: (column: string, values: any[]) => {
      filters.push((row) => values.includes(row[column]));
      return builder;
    },
    withGraphFetched: () => builder,
    throwIfNotFound: () => {
      throwIfNotFound = true;
      return builder;
    },
    patch: async (data: any) => {
      const rows = matching();
      rows.forEach((row) => Object.assign(row, data));
      return rows.length;
    },
    increment: async (column: string, amount: number) => {
      matching().forEach((row) => {
        row[column] += amount;
      });
      return 1;
    },
    insertAndFetch: async (data: any) => {
      // Behaves like MySQL with a unique index on `uniqueColumn`.
      if (
        uniqueColumn &&
        data[uniqueColumn] &&
        table.some((row) => row[uniqueColumn] === data[uniqueColumn])
      ) {
        throw new UniqueViolationError({
          nativeError: Object.assign(new Error('Duplicate entry'), {
            code: 'ER_DUP_ENTRY',
            errno: 1062,
          }),
          client: 'mysql',
          table: 'uncategorized_cashflow_transactions',
          columns: [uniqueColumn],
          constraint: 'uncategorized_cashflow_trans_plaid_trans_id_unique',
        } as any);
      }
      const row = {
        categorized: false,
        categorizeRefId: null,
        excludedAt: null,
        matchedBankTransactions: [],
        ...data,
        id: table.length + 1,
      };
      table.push(row);
      return { ...row };
    },
    then: (resolve: any, reject: any) => {
      const rows = matching().map((row) => ({ ...row }));
      const result = first ? rows[0] : rows;

      if (throwIfNotFound && !result) {
        return Promise.reject(new Error('NotFoundError')).then(resolve, reject);
      }
      return Promise.resolve(result).then(resolve, reject);
    },
  };
  return builder;
};

const createSync = (options: { uniquePlaidTransactionId?: boolean } = {}) => {
  const transactions: any[] = [];
  const accounts = [
    {
      id: ACCOUNT_ID,
      plaidAccountId: PLAID_ACCOUNT_ID,
      uncategorizedTransactions: 0,
    },
  ];
  const uniqueColumn = options.uniquePlaidTransactionId
    ? 'plaidTransactionId'
    : undefined;
  const uncategorizedModel = () => ({
    query: () => createQuery(transactions, uniqueColumn),
  });
  const accountModel = () => ({ query: () => createQuery(accounts) });
  const eventPublisher = {
    emitAsync: jest.fn((..._args: any[]) => Promise.resolve([])),
  };
  const uow = { withTransaction: (work: any, trx?: any) => work(trx) };

  const createService = new CreateUncategorizedTransactionService(
    uow as any,
    eventPublisher as any,
    uncategorizedModel as any,
  );
  const syncDb = new PlaidSyncDb(
    {} as any,
    createService,
    {} as any,
    eventPublisher as any,
    accountModel as any,
    (() => ({})) as any,
    uncategorizedModel as any,
  );
  const createdEvents = () =>
    eventPublisher.emitAsync.mock.calls.filter(
      ([eventName]) =>
        eventName === events.cashflow.onTransactionUncategorizedCreated,
    ).length;

  return { syncDb, transactions, accounts, createdEvents };
};

describe('PlaidSyncDb', () => {
  describe('syncAccountsTransactions', () => {
    it('stores a Plaid transaction delivered twice once', async () => {
      const { syncDb, transactions, createdEvents } = createSync();
      const delivered = [plaidTransaction('tx-1'), plaidTransaction('tx-2')];

      await syncDb.syncAccountsTransactions(delivered);
      await syncDb.syncAccountsTransactions(delivered);

      expect(transactions.map((t) => t.plaidTransactionId)).toEqual([
        'tx-1',
        'tx-2',
      ]);
      expect(createdEvents()).toBe(2);
    });

    it('stores a transaction listed as added and modified in one update once', async () => {
      const { syncDb, transactions } = createSync();

      await syncDb.syncAccountsTransactions([
        plaidTransaction('tx-1', { amount: 100 }),
        plaidTransaction('tx-1', { amount: 120 }),
      ]);

      expect(transactions).toHaveLength(1);
      expect(transactions[0].amount).toBe(-120);
    });

    it('updates the stored transaction when Plaid modifies it', async () => {
      const { syncDb, transactions } = createSync();

      await syncDb.syncAccountsTransactions([
        plaidTransaction('tx-1', { amount: 100, name: 'Coffee pending' }),
      ]);
      await syncDb.syncAccountsTransactions([
        plaidTransaction('tx-1', {
          amount: 112.5,
          date: '2026-11-03',
          name: 'Coffee shop',
          payment_meta: { payee: 'Coffee Inc' },
        }),
      ]);

      expect(transactions).toHaveLength(1);
      expect(transactions[0]).toMatchObject({
        id: 1,
        accountId: ACCOUNT_ID,
        amount: -112.5,
        date: '2026-11-03',
        description: 'Coffee shop',
        payee: 'Coffee Inc',
      });
    });

    it('leaves categorized, matched and excluded transactions as they are', async () => {
      const { syncDb, transactions } = createSync();

      await syncDb.syncAccountsTransactions([
        plaidTransaction('tx-categorized'),
        plaidTransaction('tx-matched'),
        plaidTransaction('tx-excluded'),
      ]);
      Object.assign(transactions[0], {
        categorized: true,
        categorizeRefId: 7,
      });
      Object.assign(transactions[1], { matchedBankTransactions: [{ id: 3 }] });
      Object.assign(transactions[2], { excludedAt: new Date() });
      const before = transactions.map((t) => ({ ...t }));

      await syncDb.syncAccountsTransactions([
        plaidTransaction('tx-categorized', { amount: 1 }),
        plaidTransaction('tx-matched', { amount: 2 }),
        plaidTransaction('tx-excluded', { amount: 3 }),
      ]);

      expect(transactions).toEqual(before);
    });

    it('counts a pending transaction once it is posted', async () => {
      const { syncDb, transactions, accounts } = createSync();

      await syncDb.syncAccountsTransactions([
        plaidTransaction('tx-1', { pending: true }),
      ]);
      await syncDb.syncAccountsTransactions([
        plaidTransaction('tx-1', { pending: false }),
      ]);

      expect(transactions).toHaveLength(1);
      expect(transactions[0].pending).toBe(false);
      expect(accounts[0].uncategorizedTransactions).toBe(1);
    });

    it('stores each transaction once when two syncs race (unique index)', async () => {
      const { syncDb, transactions, createdEvents } = createSync({
        uniquePlaidTransactionId: true,
      });
      const delivered = [plaidTransaction('tx-1'), plaidTransaction('tx-2')];

      await Promise.all([
        syncDb.syncAccountsTransactions(delivered),
        syncDb.syncAccountsTransactions(delivered),
      ]);

      expect(transactions.map((t) => t.plaidTransactionId)).toEqual([
        'tx-1',
        'tx-2',
      ]);
      // A transaction the other run stored first is not announced again,
      // which would count it twice on the account.
      expect(createdEvents()).toBe(2);
    });
  });
});
