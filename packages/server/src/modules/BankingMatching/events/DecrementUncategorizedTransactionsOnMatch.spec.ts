import { DecrementUncategorizedTransactionOnMatchingSubscriber } from './DecrementUncategorizedTransactionsOnMatch';

describe('DecrementUncategorizedTransactionOnMatchingSubscriber', () => {
  const trx = { id: 'trx' } as any;

  const buildSubscriber = () => {
    const decrement = jest.fn().mockResolvedValue(1);
    const accountModel = jest.fn(() => ({
      query: jest.fn(() => ({
        findById: jest.fn(() => ({ decrement })),
      })),
    }));
    const uncategorizedBankTransactionModel = jest.fn(() => ({
      query: jest.fn(() => ({
        whereIn: jest.fn().mockResolvedValue([{ id: 1, accountId: 10 }]),
      })),
    }));
    const subscriber =
      new DecrementUncategorizedTransactionOnMatchingSubscriber(
        accountModel as any,
        uncategorizedBankTransactionModel as any,
      );
    return { subscriber, decrement };
  };

  it('decrements the uncategorized transactions counter on matching', async () => {
    const { subscriber, decrement } = buildSubscriber();

    await subscriber.decrementUnCategorizedTransactionsOnMatching({
      uncategorizedTransactionIds: [1],
      trx,
    } as any);

    expect(decrement).toHaveBeenCalledWith('uncategorizedTransactions', 1);
  });

  it('rejects when the counter decrement fails', async () => {
    const { subscriber, decrement } = buildSubscriber();
    const rawError = new Error('decrement failed');
    decrement.mockRejectedValue(rawError);

    await expect(
      subscriber.decrementUnCategorizedTransactionsOnMatching({
        uncategorizedTransactionIds: [1],
        trx,
      } as any),
    ).rejects.toBe(rawError);
  });
});
