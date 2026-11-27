import { AccountType as PlaidAccountType } from 'plaid';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS, LinkPlaidAccountsService } from './LinkPlaidAccounts.service';

const checking = {
  account_id: 'plaid-checking',
  name: 'Checking',
  mask: '9405',
  type: PlaidAccountType.Depository,
  balances: { current: 1250.5, iso_currency_code: 'USD' },
};
const creditCard = {
  account_id: 'plaid-credit',
  name: 'Credit Card',
  mask: '3333',
  type: PlaidAccountType.Credit,
  balances: { current: 410, iso_currency_code: 'USD' },
};
const bankAccount = {
  id: 1000,
  name: 'OceanBank x9405',
  accountType: 'bank',
  currencyCode: 'USD',
  plaidAccountId: null,
};
const creditCardAccount = {
  id: 1001,
  name: 'Company Card',
  accountType: 'credit-card',
  currencyCode: 'USD',
  plaidAccountId: null,
};

const buildService = (accounts: any[] = [bankAccount, creditCardAccount]) => {
  const patch = jest.fn().mockResolvedValue(1);
  const findById = jest.fn(() => ({ patch }));
  const whereIn = jest.fn().mockResolvedValue(accounts);
  const query = jest.fn(() => ({ whereIn, findById }));
  const plaidClient = {
    accountsGet: jest
      .fn()
      .mockResolvedValue({ data: { accounts: [checking, creditCard] } }),
  };
  const uow = {
    withTransaction: jest.fn((work, trx) => work(trx ?? 'trx')),
  };
  const service = new LinkPlaidAccountsService(
    uow as any,
    plaidClient as any,
    (() => ({ query })) as any,
  );
  return { service, plaidClient, findById, patch };
};

const expectServiceError = async (promise: Promise<unknown>, type: string) => {
  try {
    await promise;
    throw new Error('Expected a service error');
  } catch (error) {
    expect(error).toBeInstanceOf(ServiceError);
    expect((error as ServiceError).errorType).toBe(type);
  }
};

describe('LinkPlaidAccountsService', () => {
  describe('validateLinks', () => {
    it('skips Plaid when no account is linked', async () => {
      const { service, plaidClient } = buildService();

      await expect(service.validateLinks('token', undefined)).resolves.toEqual(
        [],
      );
      await expect(service.validateLinks('token', [])).resolves.toEqual([]);
      expect(plaidClient.accountsGet).not.toHaveBeenCalled();
    });

    it('resolves each link to its Plaid account and existing account', async () => {
      const { service, plaidClient } = buildService();

      const links = await service.validateLinks('token', [
        { plaidAccountId: 'plaid-checking', accountId: 1000 },
        { plaidAccountId: 'plaid-credit', accountId: 1001 },
      ]);
      expect(plaidClient.accountsGet).toHaveBeenCalledWith({
        access_token: 'token',
      });
      expect(links).toEqual([
        { account: bankAccount, plaidAccount: checking },
        { account: creditCardAccount, plaidAccount: creditCard },
      ]);
    });

    it('accepts a cash account for a depository Plaid account', async () => {
      const cashAccount = { ...bankAccount, accountType: 'cash' };
      const { service } = buildService([cashAccount]);

      await expect(
        service.validateLinks('token', [
          { plaidAccountId: 'plaid-checking', accountId: 1000 },
        ]),
      ).resolves.toEqual([{ account: cashAccount, plaidAccount: checking }]);
    });

    it('rejects an account linked twice before calling Plaid', async () => {
      const { service, plaidClient } = buildService();

      await expectServiceError(
        service.validateLinks('token', [
          { plaidAccountId: 'plaid-checking', accountId: 1000 },
          { plaidAccountId: 'plaid-credit', accountId: 1000 },
        ]),
        ERRORS.ACCOUNT_LINKED_TWICE,
      );
      expect(plaidClient.accountsGet).not.toHaveBeenCalled();
    });

    it('rejects a Plaid account linked twice', async () => {
      const { service } = buildService();

      await expectServiceError(
        service.validateLinks('token', [
          { plaidAccountId: 'plaid-checking', accountId: 1000 },
          { plaidAccountId: 'plaid-checking', accountId: 1001 },
        ]),
        ERRORS.PLAID_ACCOUNT_LINKED_TWICE,
      );
    });

    it('rejects a Plaid account outside the item', async () => {
      const { service } = buildService();

      await expectServiceError(
        service.validateLinks('token', [
          { plaidAccountId: 'plaid-other', accountId: 1000 },
        ]),
        ERRORS.PLAID_ACCOUNT_NOT_FOUND,
      );
    });

    it('rejects an account that does not exist', async () => {
      const { service } = buildService([]);

      await expectServiceError(
        service.validateLinks('token', [
          { plaidAccountId: 'plaid-checking', accountId: 1000 },
        ]),
        ERRORS.ACCOUNT_NOT_FOUND,
      );
    });

    it('rejects an account already connected to a bank account', async () => {
      const { service } = buildService([
        { ...bankAccount, plaidAccountId: 'plaid-previous' },
      ]);

      await expectServiceError(
        service.validateLinks('token', [
          { plaidAccountId: 'plaid-checking', accountId: 1000 },
        ]),
        ERRORS.ACCOUNT_ALREADY_LINKED,
      );
    });

    it('rejects a bank account for a credit Plaid account', async () => {
      const { service } = buildService();

      await expectServiceError(
        service.validateLinks('token', [
          { plaidAccountId: 'plaid-credit', accountId: 1000 },
        ]),
        ERRORS.ACCOUNT_TYPE_MISMATCH,
      );
    });

    it('rejects an account in another currency', async () => {
      const { service } = buildService([
        { ...bankAccount, currencyCode: 'EUR' },
      ]);

      await expectServiceError(
        service.validateLinks('token', [
          { plaidAccountId: 'plaid-checking', accountId: 1000 },
        ]),
        ERRORS.ACCOUNT_CURRENCY_MISMATCH,
      );
    });
  });

  describe('linkAccounts', () => {
    it('stores the Plaid linkage on the existing account', async () => {
      const { service, findById, patch } = buildService();

      await service.linkAccounts('item-1', [
        { account: bankAccount as any, plaidAccount: checking as any },
      ]);
      expect(findById).toHaveBeenCalledWith(1000);
      expect(patch).toHaveBeenCalledWith({
        plaidAccountId: 'plaid-checking',
        plaidItemId: 'item-1',
        accountMask: '9405',
        bankBalance: 1250.5,
        isSyncingOwner: true,
      });
    });
  });
});
