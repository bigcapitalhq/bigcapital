import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../types/BankAccounts.types';
import { DisconnectBankAccountService } from './DisconnectBankAccount.service';

const buildService = (account: Record<string, unknown>) => {
  const lookup: any = {};
  ['findById', 'whereIn', 'withGraphFetched'].forEach((method) => {
    lookup[method] = jest.fn(() => lookup);
  });
  lookup.throwIfNotFound = jest.fn(() => Promise.resolve(account));

  const unlinkPlaidAccount = {
    unlinkAccount: jest.fn().mockResolvedValue(undefined),
  };
  const eventPublisher = { emitAsync: jest.fn().mockResolvedValue([]) };
  const uow = { withTransaction: jest.fn((work) => work('trx')) };

  const service = new DisconnectBankAccountService(
    eventPublisher as any,
    uow as any,
    unlinkPlaidAccount as any,
    (() => ({ query: () => lookup })) as any,
  );
  return { service, unlinkPlaidAccount, eventPublisher };
};

describe('DisconnectBankAccountService', () => {
  it('unlinks the account under the transaction', async () => {
    const account = {
      id: 1000,
      plaidAccountId: 'plaid-checking',
      plaidItemId: 'item-1',
      plaidItem: { plaidAccessToken: 'access-token' },
    };
    const { service, unlinkPlaidAccount, eventPublisher } =
      buildService(account);

    await service.disconnectBankAccount(1000);

    expect(unlinkPlaidAccount.unlinkAccount).toHaveBeenCalledWith(
      account,
      'trx',
    );
    expect(eventPublisher.emitAsync).toHaveBeenCalledTimes(2);
  });

  it('unlinks an account whose Plaid item is already gone', async () => {
    const account = {
      id: 1000,
      plaidAccountId: 'plaid-checking',
      plaidItemId: 'item-removed',
      plaidItem: null,
    };
    const { service, unlinkPlaidAccount } = buildService(account);

    await service.disconnectBankAccount(1000);

    expect(unlinkPlaidAccount.unlinkAccount).toHaveBeenCalledWith(
      account,
      'trx',
    );
  });

  it('rejects an account that is not connected', async () => {
    const { service, unlinkPlaidAccount } = buildService({
      id: 1000,
      plaidAccountId: null,
      plaidItemId: null,
      plaidItem: null,
    });

    try {
      await service.disconnectBankAccount(1000);
      throw new Error('Expected a service error');
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceError);
      expect((error as ServiceError).errorType).toBe(
        ERRORS.BANK_ACCOUNT_NOT_CONNECTED,
      );
    }
    expect(unlinkPlaidAccount.unlinkAccount).not.toHaveBeenCalled();
  });
});
