import {
  GetBankAccountTransactionsRepository,
  toLedgerReferenceType,
  toMatchedReferenceType,
} from './GetBankAccountTransactionsRepo.service';

describe('GetBankAccountTransactionsRepository', () => {
  describe('initMatchedTransactions', () => {
    const createRepository = (matchedRows: Array<Record<string, any>>) => {
      const whereIn = jest.fn().mockResolvedValue(matchedRows);
      const matchedModel = () => ({ query: () => ({ whereIn }) });
      const repo = new GetBankAccountTransactionsRepository(
        null as any,
        null as any,
        matchedModel as any,
      );
      return { repo, whereIn };
    };

    it('finds the matches of manual journals, which the ledger calls "Journal"', async () => {
      const { repo, whereIn } = createRepository([
        { referenceType: 'ManualJournal', referenceId: 12, uncategorizedTransactionId: 7 },
      ]);
      repo.transactions = [
        { referenceType: 'Journal', referenceId: 12 },
        { referenceType: 'Expense', referenceId: 3 },
      ];

      await repo.initMatchedTransactions();

      expect(whereIn).toHaveBeenCalledWith(
        ['referenceType', 'referenceId'],
        [
          ['ManualJournal', 12],
          ['Expense', 3],
        ],
      );
      // Keyed by the ledger reference, so the row of journal 12 reads as matched.
      expect(repo.matchedBankTransactionsMapByRef.has('Journal-12')).toBe(true);
      expect(repo.matchedBankTransactionsMapByRef.get('Journal-12')[0].uncategorizedTransactionId).toBe(7);
    });

    it('leaves other reference types unchanged', async () => {
      const { repo } = createRepository([
        { referenceType: 'Expense', referenceId: 3, uncategorizedTransactionId: 8 },
      ]);
      repo.transactions = [{ referenceType: 'Expense', referenceId: 3 }];

      await repo.initMatchedTransactions();

      expect(repo.matchedBankTransactionsMapByRef.has('Expense-3')).toBe(true);
    });
  });

  it('maps between the ledger and matched reference types', () => {
    expect(toMatchedReferenceType('Journal')).toBe('ManualJournal');
    expect(toMatchedReferenceType('SaleInvoice')).toBe('SaleInvoice');
    expect(toLedgerReferenceType('ManualJournal')).toBe('Journal');
    expect(toLedgerReferenceType('Bill')).toBe('Bill');
  });
});
