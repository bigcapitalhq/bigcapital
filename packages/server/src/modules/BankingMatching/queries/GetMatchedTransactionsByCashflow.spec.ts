import { GetMatchedTransactionsByCashflow } from './GetMatchedTransactionsByCashflow';

describe('GetMatchedTransactionsByCashflow', () => {
  let qb: Record<string, jest.Mock>;
  let service: GetMatchedTransactionsByCashflow;

  beforeEach(() => {
    // Records the conditions the candidate query is built with.
    qb = {};
    for (const method of [
      'withGraphJoined',
      'whereNull',
      'whereNotExists',
      'where',
      'whereIn',
      'modify',
      'orderBy',
    ]) {
      qb[method] = jest.fn(() => qb);
    }
    const bankTransactionModel = jest.fn(() => ({
      query: jest.fn(() => ({
        onBuild: jest.fn((callback: (query: any) => void) => {
          callback(qb);
          return Promise.resolve([]);
        }),
      })),
    }));
    const transformer = { transform: jest.fn((items) => items) };

    service = new GetMatchedTransactionsByCashflow(
      transformer as any,
      bankTransactionModel as any,
    );
  });

  it("lists cash-flow transactions recorded on the bank transactions' accounts", async () => {
    await service.getMatchedTransactions({ accountIds: [7] } as any);

    expect(qb.whereIn).toHaveBeenCalledWith('cashflowAccountId', [7]);
  });

  it('does not list cash-flow transactions by their counter account', async () => {
    await service.getMatchedTransactions({ accountIds: [7] } as any);

    expect(qb.whereIn).not.toHaveBeenCalledWith(
      'creditAccountId',
      expect.anything(),
    );
  });
});
