import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';

class TestGetMatchedTransactions extends GetMatchedTransactionsByType {}

describe('GetMatchedTransactionsByType', () => {
  const matchTransactionDTO = {
    referenceType: 'ManualJournal',
    referenceId: 5,
  };

  const buildService = (insert: jest.Mock) => {
    const service = new TestGetMatchedTransactions();
    service.matchedBankTransactionModel = jest.fn(() => ({
      query: jest.fn(() => ({ insert })),
    })) as any;
    return service;
  };

  it('inserts the matched transaction for each uncategorized transaction', async () => {
    const insert = jest.fn().mockResolvedValue(1);
    const service = buildService(insert);

    await service.createMatchedTransaction([1, 2], matchTransactionDTO);

    expect(insert).toHaveBeenCalledTimes(2);
  });

  it('rejects when one of the matched transaction rows fails to insert', async () => {
    const rawError = new Error('insert failed');
    const insert = jest
      .fn()
      .mockRejectedValueOnce(rawError)
      .mockResolvedValue(1);
    const service = buildService(insert);

    await expect(
      service.createMatchedTransaction([1, 2], matchTransactionDTO),
    ).rejects.toBe(rawError);
  });
});
