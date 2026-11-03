import { GetMatchedTransactionsByManualJournals } from './GetMatchedTransactionsByManualJournals.service';

describe('GetMatchedTransactionsByManualJournals', () => {
  let qb: Record<string, jest.Mock>;
  let service: GetMatchedTransactionsByManualJournals;

  beforeEach(() => {
    // Records the conditions the candidate query is built with.
    qb = {};
    for (const method of [
      'withGraphJoined',
      'whereNull',
      'where',
      'whereIn',
      'modify',
    ]) {
      qb[method] = jest.fn(() => qb);
    }
    const manualJournalModel = jest.fn(() => ({
      query: jest.fn(() => ({
        onBuild: jest.fn((callback: (query: any) => void) => {
          callback(qb);
          return Promise.resolve([]);
        }),
      })),
    }));
    const transformer = { transform: jest.fn((items) => items) };

    service = new GetMatchedTransactionsByManualJournals(
      transformer as any,
      manualJournalModel as any,
    );
  });

  it("lists journals with an entry on the bank transactions' accounts", async () => {
    await service.getMatchedTransactions({ accountIds: [7, 9] } as any);

    expect(qb.whereIn).toHaveBeenCalledWith('entries.accountId', [7, 9]);
  });

  it('never filters journals by account 1000', async () => {
    await service.getMatchedTransactions({ accountIds: [7] } as any);

    expect(qb.where).not.toHaveBeenCalledWith('entries.accountId', 1000);
  });
});
