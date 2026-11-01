import { PlaidSyncDb } from './PlaidSyncDB';

const plaidAccount = (accountId: string, current: number | null) =>
  ({ account_id: accountId, balances: { current } }) as any;

describe('PlaidSyncDb', () => {
  describe('updateAccountsBankBalance', () => {
    it('stores the current balance of each Plaid account', async () => {
      const patch = jest.fn().mockResolvedValue(1);
      const where = jest.fn(() => ({ patch }));
      const syncDb = new PlaidSyncDb(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        (() => ({ query: () => ({ where }) })) as any,
        (() => ({})) as any,
        (() => ({})) as any,
      );

      await syncDb.updateAccountsBankBalance([
        plaidAccount('plaid-checking', 1250.5),
        plaidAccount('plaid-savings', null),
        plaidAccount('plaid-credit', 0),
      ]);
      expect(where).toHaveBeenCalledTimes(2);
      expect(where).toHaveBeenCalledWith('plaid_account_id', 'plaid-checking');
      expect(where).toHaveBeenCalledWith('plaid_account_id', 'plaid-credit');
      expect(patch).toHaveBeenCalledWith({ bankBalance: 1250.5 });
      expect(patch).toHaveBeenCalledWith({ bankBalance: 0 });
    });
  });
});
