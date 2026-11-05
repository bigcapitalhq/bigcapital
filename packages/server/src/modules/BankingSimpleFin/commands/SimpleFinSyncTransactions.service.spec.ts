import { SimpleFinSyncTransactionsService } from './SimpleFinSyncTransactions.service';

/**
 * Builds a chainable objection-like query mock whose terminal awaits resolve
 * to `result`. Every chained method returns the same builder.
 */
const buildQuery = (result: any) => {
  const builder: any = {};
  const methods = [
    'findOne',
    'findById',
    'forUpdate',
    'where',
    'whereIn',
    'whereNotNull',
    'select',
    'patch',
  ];
  methods.forEach((m) => {
    builder[m] = jest.fn(() => builder);
  });
  builder.then = (resolve: any, reject: any) =>
    Promise.resolve(result).then(resolve, reject);
  return builder;
};

const config = (overrides: Record<string, any> = {}) => ({
  get: jest.fn((key: string) => {
    const values = {
      'simplefin.syncIntervalHours': 12,
      'simplefin.initialSyncDays': 90,
      'simplefin.syncOverlapDays': 7,
      ...overrides,
    };
    return values[key];
  }),
});

describe('SimpleFinSyncTransactionsService', () => {
  const trx = {} as any;

  const buildService = ({
    item,
    linkedAccounts = [],
    existingIds = [],
    accountSet = { errors: [], accounts: [] },
  }: {
    item: any;
    linkedAccounts?: any[];
    existingIds?: string[];
    accountSet?: any;
  }) => {
    const itemQuery = buildQuery(item);
    const accountsQuery = buildQuery(linkedAccounts);
    const accountPatchQuery = buildQuery(1);
    const existingQuery = buildQuery(
      existingIds.map((id) => ({ simplefinTransactionId: id })),
    );
    let accountQueryCalls = 0;

    const uow = {
      withTransaction: jest.fn((work: any) => work(trx)),
    };
    const eventPublisher = {
      emitAsync: jest.fn().mockResolvedValue(undefined),
    };
    const client = { getAccounts: jest.fn().mockResolvedValue(accountSet) };
    const createUncategorized = {
      create: jest.fn().mockResolvedValue({ id: 1 }),
    };
    const accountModel = jest.fn(() => ({
      query: jest.fn(() => {
        // First call lists the linked accounts, later calls patch balances.
        accountQueryCalls += 1;
        return accountQueryCalls === 1 ? accountsQuery : accountPatchQuery;
      }),
    }));
    const itemModel = jest.fn(() => ({ query: jest.fn(() => itemQuery) }));
    const uncategorizedModel = jest.fn(() => ({
      query: jest.fn(() => existingQuery),
    }));

    const service = new SimpleFinSyncTransactionsService(
      uow as any,
      config() as any,
      eventPublisher as any,
      client as any,
      createUncategorized as any,
      accountModel as any,
      itemModel as any,
      uncategorizedModel as any,
    );
    return {
      service,
      client,
      createUncategorized,
      eventPublisher,
      itemQuery,
      accountPatchQuery,
    };
  };

  describe('isSyncDue', () => {
    it('is due when the item was never synced', () => {
      const { service } = buildService({ item: null });

      expect(service.isSyncDue({ lastSyncedAt: null } as any)).toBe(true);
    });

    it('is due once the configured interval elapsed', () => {
      const { service } = buildService({ item: null });
      const thirteenHoursAgo = new Date(Date.now() - 13 * 3600 * 1000);
      const oneHourAgo = new Date(Date.now() - 3600 * 1000);

      expect(service.isSyncDue({ lastSyncedAt: thirteenHoursAgo } as any)).toBe(
        true,
      );
      expect(service.isSyncDue({ lastSyncedAt: oneHourAgo } as any)).toBe(
        false,
      );
    });
  });

  describe('syncItem', () => {
    it('skips missing items without calling SimpleFIN', async () => {
      const { service, client } = buildService({ item: null });

      await expect(service.syncItem('missing')).resolves.toEqual({
        addedCount: 0,
        skipped: true,
      });
      expect(client.getAccounts).not.toHaveBeenCalled();
    });

    it('skips paused items', async () => {
      const { service, client } = buildService({
        item: { id: 1, isPaused: true, lastSyncedAt: null, accessUrl: 'u' },
      });
      await expect(service.syncItem('item')).resolves.toMatchObject({
        skipped: true,
      });
      expect(client.getAccounts).not.toHaveBeenCalled();
    });

    it('skips items that are not due unless forced', async () => {
      const item = {
        id: 1,
        isPaused: false,
        lastSyncedAt: new Date(),
        accessUrl: 'https://u:p@bridge.example/simplefin',
      };
      const notForced = buildService({ item });
      await expect(notForced.service.syncItem('item')).resolves.toMatchObject({
        skipped: true,
      });
      expect(notForced.client.getAccounts).not.toHaveBeenCalled();

      const forced = buildService({ item, linkedAccounts: [] });
      await forced.service.syncItem('item', true);
      // Forced but no linked accounts: still skipped, still no request.
      expect(forced.client.getAccounts).not.toHaveBeenCalled();
    });

    it('imports only new transactions and refreshes balances', async () => {
      const item = {
        id: 1,
        isPaused: false,
        lastSyncedAt: null,
        accessUrl: 'https://u:p@bridge.example/simplefin',
      };
      const linkedAccounts = [
        { id: 10, simplefinAccountId: 'ACT-1', currencyCode: 'USD' },
      ];
      const accountSet = {
        errors: ['Connection may need attention'],
        accounts: [
          {
            id: 'ACT-1',
            balance: '99.10',
            transactions: [
              {
                id: 'T-old',
                posted: 1762214400,
                amount: '1',
                description: 'a',
              },
              {
                id: 'T-new',
                posted: 1762214400,
                amount: '-2',
                description: 'b',
              },
              {
                id: 'T-pending',
                posted: 0,
                amount: '-3',
                description: 'c',
                pending: true,
              },
            ],
          },
        ],
      };
      const {
        service,
        client,
        createUncategorized,
        eventPublisher,
        itemQuery,
        accountPatchQuery,
      } = buildService({
        item,
        linkedAccounts,
        existingIds: ['T-old'],
        accountSet,
      });

      await expect(service.syncItem('item')).resolves.toEqual({
        addedCount: 1,
        skipped: false,
      });

      // Requests only the linked accounts with a start date.
      expect(client.getAccounts).toHaveBeenCalledWith(
        item.accessUrl,
        expect.objectContaining({
          accountIds: ['ACT-1'],
          startDate: expect.any(Date),
        }),
      );
      // Only the new, non-pending transaction is created.
      expect(createUncategorized.create).toHaveBeenCalledTimes(1);
      expect(createUncategorized.create).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: 10,
          simplefinTransactionId: 'T-new',
          amount: -2,
          currencyCode: 'USD',
          batch: expect.any(String),
        }),
        trx,
      );
      // Recognition event emitted for the batch.
      expect(eventPublisher.emitAsync).toHaveBeenCalledWith(
        'onSimpleFinTransactionsSynced',
        expect.objectContaining({ accountId: 10, simplefinAccountId: 'ACT-1' }),
      );
      // Balance + feeds flags refreshed, last synced stamped.
      expect(accountPatchQuery.patch).toHaveBeenCalledWith(
        expect.objectContaining({ bankBalance: 99.1, isFeedsActive: true }),
      );
      expect(itemQuery.patch).toHaveBeenCalledWith(
        expect.objectContaining({ lastSyncedAt: expect.any(Date) }),
      );
    });
  });
});
