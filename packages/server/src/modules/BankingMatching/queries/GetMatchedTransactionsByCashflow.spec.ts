import { GetMatchedTransactionsByCashflow } from './GetMatchedTransactionsByCashflow';
import { ERRORS } from '../types';

describe('GetMatchedTransactionsByCashflow', () => {
  let qb: Record<string, jest.Mock>;
  let lookupChain: any;
  let subQb: Record<string, jest.Mock>;
  let service: GetMatchedTransactionsByCashflow;

  const chainable = (target: any, methods: string[]) => {
    for (const method of methods) {
      target[method] = jest.fn(() => target);
    }
    return target;
  };
  // The single-transaction lookup: a thenable chain resolving the given row.
  const buildLookupChain = (row: any) => {
    const chain = chainable(Object.assign(Promise.resolve(row), {}), [
      'findById',
      'withGraphJoined',
      'whereNull',
      'whereNotExists',
      'modify',
      'throwIfNotFound',
    ]);
    chain.onBuild = jest.fn((callback: (query: any) => void) => {
      callback(qb);
      return Promise.resolve([]);
    });
    return chain;
  };

  beforeEach(() => {
    // Records the conditions the candidate (list) query is built with.
    qb = chainable({}, [
      'withGraphJoined',
      'whereNull',
      'whereNotExists',
      'where',
      'whereIn',
      'modify',
      'orderBy',
    ]);
    lookupChain = buildLookupChain({ id: 3, cashflowAccountId: 7 });
    const bankTransactionModel = jest.fn(() => ({
      query: jest.fn(() => lookupChain),
    }));
    const transformer = { transform: jest.fn((items) => items) };

    service = new GetMatchedTransactionsByCashflow(
      transformer as any,
      bankTransactionModel as any,
    );
    // The matched bank transactions subquery.
    subQb = chainable({}, ['where', 'whereColumn']);
    service.matchedBankTransactionModel = jest.fn(() => ({
      query: jest.fn(() => subQb),
    })) as any;
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

  it('excludes cash-flow transactions already matched as CashflowTransaction', async () => {
    await service.getMatchedTransactions({ accountIds: [7] } as any);

    expect(qb.whereNotExists).toHaveBeenCalledWith(subQb);
    expect(subQb.where).toHaveBeenCalledWith(
      'referenceType',
      'CashflowTransaction',
    );
    expect(subQb.whereColumn).toHaveBeenCalledWith(
      'referenceId',
      'cashflowTransactions.id',
    );
    expect(qb.withGraphJoined).not.toHaveBeenCalledWith(
      'matchedBankTransaction',
    );
  });

  it('refuses to look up a cash-flow transaction that is already matched', async () => {
    await service.getMatchedTransaction(3, [7]);

    expect(lookupChain.whereNotExists).toHaveBeenCalledWith(subQb);
  });

  it('refuses a cash-flow transaction recorded on another account', async () => {
    lookupChain = buildLookupChain({ id: 3, cashflowAccountId: 9 });

    await expect(service.getMatchedTransaction(3, [7])).rejects.toMatchObject({
      errorType: ERRORS.MATCHING_TRANSACTION_ACCOUNT_INVALID,
    });
  });
});
