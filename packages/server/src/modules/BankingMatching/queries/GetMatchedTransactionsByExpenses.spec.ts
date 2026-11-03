import { GetMatchedTransactionsByExpenses } from './GetMatchedTransactionsByExpenses';

describe('GetMatchedTransactionsByExpenses', () => {
  let qb: Record<string, jest.Mock>;
  let service: GetMatchedTransactionsByExpenses;

  beforeEach(() => {
    // Records the conditions the candidate query is built with.
    qb = {};
    for (const method of [
      'withGraphJoined',
      'whereNull',
      'where',
      'whereIn',
      'modify',
      'orderBy',
    ]) {
      qb[method] = jest.fn(() => qb);
    }
    const expenseModel = jest.fn(() => ({
      query: jest.fn(() => ({
        onBuild: jest.fn((callback: (query: any) => void) => {
          callback(qb);
          return Promise.resolve([]);
        }),
      })),
    }));
    const transformer = { transform: jest.fn((items) => items) };

    service = new GetMatchedTransactionsByExpenses(
      transformer as any,
      expenseModel as any,
      jest.fn() as any,
      jest.fn() as any,
    );
  });

  it("lists expenses paid from the bank transactions' accounts", async () => {
    await service.getMatchedTransactions({ accountIds: [7] } as any);

    expect(qb.whereIn).toHaveBeenCalledWith('paymentAccountId', [7]);
  });
});
