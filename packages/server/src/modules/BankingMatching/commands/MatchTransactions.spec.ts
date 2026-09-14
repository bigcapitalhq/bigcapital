import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { MatchBankTransactions } from './MatchTransactions';

describe('MatchBankTransactions', () => {
  const trx = { id: 'trx' } as any;

  let uow: { withTransaction: jest.Mock };
  let eventPublisher: { emitAsync: jest.Mock };
  let matchedService: {
    getMatchedTransaction: jest.Mock;
    createMatchedTransaction: jest.Mock;
  };
  let matchedBankTransactions: { registry: { get: jest.Mock } };
  let uncategorizedBankTransactionModel: jest.Mock;
  let service: MatchBankTransactions;

  const buildUncategorizedQuery = (transactions: any[]) => {
    const queryBuilder = Object.assign(Promise.resolve(transactions), {
      forUpdate: jest.fn(),
    });
    const chain: any = {
      whereIn: jest.fn(() => chain),
      orderBy: jest.fn(() => chain),
      withGraphFetched: jest.fn(() => chain),
      throwIfNotFound: jest.fn(() => queryBuilder),
    };
    return { query: jest.fn(() => chain) };
  };

  beforeEach(() => {
    uow = {
      withTransaction: jest.fn((callback: (trx: any) => any) => callback(trx)),
    };
    eventPublisher = {
      emitAsync: jest.fn().mockResolvedValue(undefined),
    };
    matchedService = {
      getMatchedTransaction: jest
        .fn()
        .mockResolvedValue({ amount: 100, transactionNormal: 'debit' }),
      createMatchedTransaction: jest.fn().mockResolvedValue(undefined),
    };
    matchedBankTransactions = {
      registry: { get: jest.fn(() => matchedService) },
    };
    uncategorizedBankTransactionModel = jest.fn(() =>
      buildUncategorizedQuery([
        {
          id: 1,
          amount: 100,
          excluded: false,
          matchedBankTransactions: [],
        },
      ]),
    );
    service = new MatchBankTransactions(
      uow as any,
      eventPublisher as any,
      matchedBankTransactions as any,
      uncategorizedBankTransactionModel as any,
    );
  });

  it('emits the matching and matched events on success', async () => {
    await service.matchTransaction(
      [1],
      [{ referenceType: 'SaleInvoice', referenceId: 5 }],
    );

    expect(eventPublisher.emitAsync).toHaveBeenCalledWith(
      events.bankMatch.onMatching,
      expect.anything(),
    );
    expect(eventPublisher.emitAsync).toHaveBeenCalledWith(
      events.bankMatch.onMatched,
      expect.anything(),
    );
  });

  it('rejects and skips the matched event when a matched transaction fails', async () => {
    const rawError = new Error('payment received creation failed');
    matchedService.createMatchedTransaction.mockRejectedValue(rawError);

    await expect(
      service.matchTransaction(
        [1],
        [{ referenceType: 'SaleInvoice', referenceId: 5 }],
      ),
    ).rejects.toBe(rawError);

    expect(eventPublisher.emitAsync).toHaveBeenCalledWith(
      events.bankMatch.onMatching,
      expect.anything(),
    );
    expect(eventPublisher.emitAsync).not.toHaveBeenCalledWith(
      events.bankMatch.onMatched,
      expect.anything(),
    );
  });

  it('rejects when the matched transaction is not found', async () => {
    matchedService.getMatchedTransaction.mockResolvedValue(undefined);

    await expect(
      service.matchTransaction(
        [1],
        [{ referenceType: 'SaleInvoice', referenceId: 5 }],
      ),
    ).rejects.toBeInstanceOf(ServiceError);

    expect(matchedService.createMatchedTransaction).not.toHaveBeenCalled();
    expect(eventPublisher.emitAsync).not.toHaveBeenCalled();
  });
});
