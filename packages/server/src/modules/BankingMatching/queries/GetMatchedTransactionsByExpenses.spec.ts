import { GetMatchedTransactionsByExpenses } from './GetMatchedTransactionsByExpenses';
import { ERRORS } from '../types';
import { Expense } from '@/modules/Expenses/models/Expense.model';

describe('GetMatchedTransactionsByExpenses', () => {
  let qb: Record<string, jest.Mock>;
  let lookupChain: any;
  let service: GetMatchedTransactionsByExpenses;

  const chainable = (target: any, methods: string[]) => {
    for (const method of methods) {
      target[method] = jest.fn(() => target);
    }
    return target;
  };
  // The single-expense lookup: a thenable chain resolving the given row.
  const buildLookupChain = (row: any) => {
    const chain = chainable(Object.assign(Promise.resolve(row), {}), [
      'findById',
      'modify',
      'whereNotExists',
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
      'where',
      'whereIn',
      'modify',
      'orderBy',
    ]);
    lookupChain = buildLookupChain({ id: 3, paymentAccountId: 7 });
    const expenseModel = jest.fn(() => ({
      query: jest.fn(() => lookupChain),
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

  it('refuses an expense paid from another account', async () => {
    lookupChain = buildLookupChain({ id: 3, paymentAccountId: 9 });

    await expect(service.getMatchedTransaction(3, [7])).rejects.toMatchObject({
      errorType: ERRORS.MATCHING_TRANSACTION_ACCOUNT_INVALID,
    });
  });

  it('looks up only published expenses that are not matched yet', async () => {
    const matchedQuery = { kind: 'matched bank transactions of the expense' };
    const relatedQuery = jest
      .spyOn(Expense, 'relatedQuery')
      .mockReturnValue(matchedQuery as any);

    await service.getMatchedTransaction(3, [7]);

    expect(lookupChain.modify).toHaveBeenCalledWith('filterByPublished');
    expect(relatedQuery).toHaveBeenCalledWith('matchedBankTransaction');
    expect(lookupChain.whereNotExists).toHaveBeenCalledWith(matchedQuery);
    relatedQuery.mockRestore();
  });

  it('returns the expense when it is paid from the bank account', async () => {
    await expect(service.getMatchedTransaction(3, [7])).resolves.toMatchObject({
      id: 3,
    });
  });
});
