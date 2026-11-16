import { ServiceError } from '@/modules/Items/ServiceError';
import { UpdateBankingPlaidTransitionsJob } from '@/modules/BankingPlaid/types/BankingPlaid.types';
import { ERRORS } from '../types/BankAccounts.types';
import { RefreshBankAccountService } from './RefreshBankAccount.service';

const buildService = ({
  plaidItem = { plaidItemId: 'item-1', plaidAccessToken: 'access-token' },
  refresh = jest.fn().mockResolvedValue({}),
}: { plaidItem?: unknown; refresh?: jest.Mock } = {}) => {
  const lookup: any = {};
  lookup.findById = jest.fn(() => lookup);
  lookup.withGraphFetched = jest.fn(() => lookup);
  lookup.throwIfNotFound = jest
    .fn()
    .mockResolvedValue({ id: 1000, plaidItemId: 'item-1', plaidItem });

  const plaidClient = { transactionsRefresh: refresh };
  const queue = { add: jest.fn().mockResolvedValue({}) };

  const service = new RefreshBankAccountService(
    plaidClient as any,
    (() => ({ query: () => lookup })) as any,
    queue as any,
  );
  return { service, plaidClient, queue };
};

describe('RefreshBankAccountService', () => {
  it('queues a sync of the Plaid item and asks Plaid to refresh', async () => {
    const { service, plaidClient, queue } = buildService();

    await service.refreshBankAccount(1000);

    expect(queue.add).toHaveBeenCalledWith(
      UpdateBankingPlaidTransitionsJob,
      { plaidItemId: 'item-1' },
      { jobId: 'item-1', removeOnComplete: true, removeOnFail: true },
    );
    expect(plaidClient.transactionsRefresh).toHaveBeenCalledWith({
      access_token: 'access-token',
    });
  });

  it('still queues the sync when the Plaid refresh fails', async () => {
    const { service, queue } = buildService({
      refresh: jest.fn().mockRejectedValue(new Error('PRODUCT_NOT_READY')),
    });

    await expect(service.refreshBankAccount(1000)).resolves.toBeUndefined();
    expect(queue.add).toHaveBeenCalled();
  });

  it('rejects an account not connected to Plaid', async () => {
    const { service, queue } = buildService({ plaidItem: null });

    try {
      await service.refreshBankAccount(1000);
      throw new Error('Expected a service error');
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceError);
      expect((error as ServiceError).errorType).toBe(
        ERRORS.BANK_ACCOUNT_NOT_CONNECTED,
      );
    }
    expect(queue.add).not.toHaveBeenCalled();
  });
});
