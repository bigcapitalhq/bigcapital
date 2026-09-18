import { DisconnectBankAccountService } from './DisconnectBankAccount.service';

// Chainable query builder mock resolving to the given result.
const queryBuilder = (result?: unknown) => {
  const builder: any = {};
  [
    'findById',
    'findOne',
    'where',
    'whereIn',
    'whereNot',
    'whereNotNull',
    'withGraphFetched',
  ].forEach((method) => {
    builder[method] = jest.fn(() => builder);
  });
  builder.throwIfNotFound = jest.fn(() => Promise.resolve(result));
  builder.patch = jest.fn(() => Promise.resolve(1));
  builder.delete = jest.fn(() => Promise.resolve(1));
  builder.then = (resolve: any, reject: any) =>
    Promise.resolve(result).then(resolve, reject);
  return builder;
};

const buildService = (otherItemAccounts: unknown[]) => {
  const account = {
    id: 1000,
    plaidAccountId: 'plaid-checking',
    plaidItemId: 'item-1',
    plaidItem: {
      plaidAccessToken: 'access-token',
      disconnectedPlaidAccountIds: ['plaid-savings'],
    },
  };
  const accountLookup = queryBuilder(account);
  const otherAccountsQuery = queryBuilder(otherItemAccounts);
  const accountPatch = queryBuilder();
  const plaidItemQuery = queryBuilder();

  const accountModel = {
    query: jest
      .fn()
      .mockReturnValueOnce(accountLookup)
      .mockReturnValueOnce(otherAccountsQuery)
      .mockReturnValueOnce(accountPatch),
  };
  const plaidClient = { itemRemove: jest.fn().mockResolvedValue({}) };
  const eventPublisher = { emitAsync: jest.fn().mockResolvedValue([]) };
  const uow = { withTransaction: jest.fn((work) => work('trx')) };

  const service = new DisconnectBankAccountService(
    eventPublisher as any,
    uow as any,
    plaidClient as any,
    (() => accountModel) as any,
    (() => ({ query: () => plaidItemQuery })) as any,
  );
  return { service, plaidClient, accountPatch, plaidItemQuery };
};

describe('DisconnectBankAccountService', () => {
  it('keeps the Plaid item while other accounts are fed by it', async () => {
    const { service, plaidClient, accountPatch, plaidItemQuery } = buildService(
      [{ id: 1001 }],
    );

    await service.disconnectBankAccount(1000);

    expect(plaidItemQuery.patch).toHaveBeenCalledWith({
      disconnectedPlaidAccountIds: ['plaid-savings', 'plaid-checking'],
    });
    expect(plaidItemQuery.delete).not.toHaveBeenCalled();
    expect(plaidClient.itemRemove).not.toHaveBeenCalled();
    expect(accountPatch.patch).toHaveBeenCalledWith({
      plaidAccountId: null,
      plaidItemId: null,
      isFeedsActive: false,
    });
  });

  it('removes the Plaid item with its last account', async () => {
    const { service, plaidClient, accountPatch, plaidItemQuery } = buildService(
      [],
    );

    await service.disconnectBankAccount(1000);

    expect(plaidItemQuery.delete).toHaveBeenCalled();
    expect(plaidItemQuery.patch).not.toHaveBeenCalled();
    expect(plaidClient.itemRemove).toHaveBeenCalledWith({
      access_token: 'access-token',
    });
    expect(accountPatch.patch).toHaveBeenCalledWith({
      plaidAccountId: null,
      plaidItemId: null,
      isFeedsActive: false,
    });
  });
});
