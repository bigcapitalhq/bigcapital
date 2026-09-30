import { DisconnectPlaidItemOnAccountDeleted } from './DisconnectPlaidItemOnAccountDeleted';

describe('DisconnectPlaidItemOnAccountDeleted', () => {
  const buildSubscriber = () => {
    const unlinkPlaidAccount = {
      unlinkAccount: jest.fn().mockResolvedValue(undefined),
    };
    const subscriber = new DisconnectPlaidItemOnAccountDeleted(
      unlinkPlaidAccount as any,
    );
    return { subscriber, unlinkPlaidAccount };
  };

  it('unlinks the deleted account from its Plaid item', async () => {
    const { subscriber, unlinkPlaidAccount } = buildSubscriber();
    const oldAccount = {
      id: 1000,
      plaidAccountId: 'plaid-credit',
      plaidItemId: 'item-1',
    };

    await subscriber.handleDisconnectPlaidItemOnAccountDelete({
      oldAccount,
      trx: 'trx',
    } as any);

    expect(unlinkPlaidAccount.unlinkAccount).toHaveBeenCalledWith(
      oldAccount,
      'trx',
    );
  });

  it('ignores an account not connected to Plaid', async () => {
    const { subscriber, unlinkPlaidAccount } = buildSubscriber();

    await subscriber.handleDisconnectPlaidItemOnAccountDelete({
      oldAccount: { id: 1000, plaidAccountId: null, plaidItemId: null },
      trx: 'trx',
    } as any);

    expect(unlinkPlaidAccount.unlinkAccount).not.toHaveBeenCalled();
  });
});
