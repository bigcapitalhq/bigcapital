import { GetMatchedTransactionManualJournalsTransformer } from './GetMatchedTransactionManualJournalsTransformer';

describe('GetMatchedTransactionManualJournalsTransformer', () => {
  // A split journal: 150 in total, of which two lines (60 + 40) are on the
  // bank account, so only those entries are loaded.
  const journal = {
    amount: 150,
    currencyCode: 'USD',
    entries: [
      { debit: 60, credit: 0 },
      { debit: 40, credit: 0 },
    ],
  };
  const transformer = new GetMatchedTransactionManualJournalsTransformer();

  it('computes the amount from the bank-account entries', () => {
    expect((transformer as any).amount(journal)).toBe(100);
  });

  it('formats the bank-side amount, not the journal total', () => {
    const label = (transformer as any).amountFormatted(journal);

    expect(label).toContain('100.00');
    expect(label).not.toContain('150');
  });
});
