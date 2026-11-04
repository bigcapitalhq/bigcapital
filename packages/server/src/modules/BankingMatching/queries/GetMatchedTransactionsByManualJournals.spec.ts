import { GetMatchedTransactionsByManualJournals } from './GetMatchedTransactionsByManualJournals.service';
import { ERRORS } from '../types';

describe('GetMatchedTransactionsByManualJournals', () => {
  let qb: Record<string, jest.Mock>;
  let lookupChain: any;
  let service: GetMatchedTransactionsByManualJournals;

  const chainable = (target: any, methods: string[]) => {
    for (const method of methods) {
      target[method] = jest.fn(() => target);
    }
    return target;
  };
  // The single-journal lookup: a thenable chain resolving the given row.
  const buildLookupChain = (row: any) => {
    const chain = chainable(Object.assign(Promise.resolve(row), {}), [
      'findById',
      'modify',
      'whereNotExists',
      'withGraphFetched',
      'modifyGraph',
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
    ]);
    lookupChain = buildLookupChain({
      id: 4,
      entries: [{ accountId: 7, debit: 100, credit: 0 }],
    });
    const manualJournalModel = jest.fn(() => ({
      query: jest.fn(() => lookupChain),
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

  it("loads only the journal entries on the bank transactions' accounts", async () => {
    await service.getMatchedTransaction(4, [7]);

    expect(lookupChain.withGraphFetched).toHaveBeenCalledWith('entries');
    const [relation, modifier] = lookupChain.modifyGraph.mock.calls[0];
    expect(relation).toBe('entries');
    const entriesQb = { whereIn: jest.fn() };
    modifier(entriesQb);
    expect(entriesQb.whereIn).toHaveBeenCalledWith('accountId', [7]);
  });

  it('looks up only published journals', async () => {
    await service.getMatchedTransaction(4, [7]);

    expect(lookupChain.modify).toHaveBeenCalledWith('filterByPublished');
  });

  it('refuses a journal with no entry on the bank account', async () => {
    lookupChain = buildLookupChain({ id: 4, entries: [] });

    await expect(service.getMatchedTransaction(4, [7])).rejects.toMatchObject({
      errorType: ERRORS.MATCHING_TRANSACTION_ACCOUNT_INVALID,
    });
  });
});
