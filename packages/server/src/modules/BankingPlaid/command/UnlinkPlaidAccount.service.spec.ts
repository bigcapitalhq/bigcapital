import { UnlinkPlaidAccountService } from './UnlinkPlaidAccount.service';

// Chainable query builder mock resolving to the given result.
const queryBuilder = (result?: unknown) => {
  const builder: any = {};
  ['findById', 'findOne', 'where', 'whereNot', 'whereNotNull'].forEach(
    (method) => {
      builder[method] = jest.fn(() => builder);
    },
  );
  builder.patch = jest.fn(() => Promise.resolve(1));
  builder.delete = jest.fn(() => Promise.resolve(1));
  builder.then = (resolve: any, reject: any) =>
    Promise.resolve(result).then(resolve, reject);
  return builder;
};

const account = {
  id: 1000,
  plaidAccountId: 'plaid-checking',
  plaidItemId: 'item-1',
};

const buildService = (plaidItem: unknown, otherItemAccounts: unknown[]) => {
  const accountPatch = queryBuilder();
  const otherAccountsQuery = queryBuilder(otherItemAccounts);
  const plaidItemLookup = queryBuilder(plaidItem);
  const plaidItemMutation = queryBuilder();

  const accountModel = {
    query: jest
      .fn()
      .mockReturnValueOnce(accountPatch)
      .mockReturnValueOnce(otherAccountsQuery),
  };
  const plaidItemModel = {
    query: jest
      .fn()
      .mockReturnValueOnce(plaidItemLookup)
      .mockReturnValueOnce(plaidItemMutation),
  };
  const plaidClient = { itemRemove: jest.fn().mockResolvedValue({}) };

  const service = new UnlinkPlaidAccountService(
    plaidClient as any,
    (() => accountModel) as any,
    (() => plaidItemModel) as any,
  );
  return { service, plaidClient, accountPatch, plaidItemMutation };
};

const plaidItem = {
  id: 7,
  plaidAccessToken: 'access-token',
  disconnectedPlaidAccountIds: ['plaid-savings'],
};

describe('UnlinkPlaidAccountService', () => {
  it('keeps the Plaid item while other accounts are fed by it', async () => {
    const { service, plaidClient, accountPatch, plaidItemMutation } =
      buildService(plaidItem, [{ id: 1001 }]);

    await service.unlinkAccount(account, 'trx' as any);

    expect(accountPatch.findById).toHaveBeenCalledWith(1000);
    expect(accountPatch.patch).toHaveBeenCalledWith({
      plaidAccountId: null,
      plaidItemId: null,
      isFeedsActive: false,
    });
    expect(plaidItemMutation.findById).toHaveBeenCalledWith(7);
    expect(plaidItemMutation.patch).toHaveBeenCalledWith({
      disconnectedPlaidAccountIds: ['plaid-savings', 'plaid-checking'],
    });
    expect(plaidItemMutation.delete).not.toHaveBeenCalled();
    expect(plaidClient.itemRemove).not.toHaveBeenCalled();
  });

  it('removes the Plaid item with its last account', async () => {
    const { service, plaidClient, accountPatch, plaidItemMutation } =
      buildService(plaidItem, []);

    await service.unlinkAccount(account, 'trx' as any);

    expect(accountPatch.patch).toHaveBeenCalled();
    expect(plaidItemMutation.delete).toHaveBeenCalled();
    expect(plaidItemMutation.patch).not.toHaveBeenCalled();
    expect(plaidClient.itemRemove).toHaveBeenCalledWith({
      access_token: 'access-token',
    });
  });

  it('only unlinks the account when its Plaid item is already gone', async () => {
    const { service, plaidClient, accountPatch, plaidItemMutation } =
      buildService(undefined, [{ id: 1001 }]);

    await service.unlinkAccount(account, 'trx' as any);

    expect(accountPatch.patch).toHaveBeenCalled();
    expect(plaidItemMutation.patch).not.toHaveBeenCalled();
    expect(plaidItemMutation.delete).not.toHaveBeenCalled();
    expect(plaidClient.itemRemove).not.toHaveBeenCalled();
  });

  it('only unlinks an account without a Plaid item id', async () => {
    const { service, plaidClient, accountPatch, plaidItemMutation } =
      buildService(plaidItem, []);

    await service.unlinkAccount(
      { ...account, plaidItemId: null as any },
      'trx' as any,
    );

    expect(accountPatch.patch).toHaveBeenCalled();
    expect(plaidItemMutation.delete).not.toHaveBeenCalled();
    expect(plaidClient.itemRemove).not.toHaveBeenCalled();
  });
});
