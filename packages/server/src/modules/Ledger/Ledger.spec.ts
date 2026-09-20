import { Ledger } from './Ledger';
import { ILedgerEntry } from './types/Ledger.types';

const entry = (overrides: Partial<ILedgerEntry>): ILedgerEntry => ({
  id: 1,
  credit: 0,
  debit: 0,
  currencyCode: 'USD',
  exchangeRate: 1,
  accountId: 1,
  accountNormal: 'debit',
  date: '2023-02-05',
  transactionType: 'Journal',
  transactionId: 1,
  transactionNumber: 'JV-1',
  index: 1,
  ...overrides,
});

const undated = (overrides: Partial<ILedgerEntry> = {}) => ({
  ...entry(overrides),
  date: undefined as unknown as string,
});

describe('Ledger', () => {
  describe('whereToDate', () => {
    it('keeps the entries on or before the given date', () => {
      const ledger = new Ledger([
        entry({ id: 1, date: '2023-01-31' }),
        entry({ id: 2, date: '2023-02-01' }),
        entry({ id: 3, date: '2023-03-01' }),
      ]);
      expect(
        ledger
          .whereToDate('2023-02-01')
          .getEntries()
          .map((e) => e.id),
      ).toEqual([1, 2]);
    });

    it('drops the entries that carry no date', () => {
      // moment compares an undefined date against now, so an undated entry
      // falls outside every past bound. `whereToDateOrUndated` exists for the
      // aggregated ledgers where that is the wrong answer.
      const ledger = new Ledger([undated({ id: 1 })]);

      expect(ledger.whereToDate('2023-02-01').getEntries()).toHaveLength(0);
    });
  });

  describe('whereToDateOrUndated', () => {
    it('keeps the entries that carry no date', () => {
      const ledger = new Ledger([
        undated({ id: 1, debit: 500 }),
        entry({ id: 2, date: '2023-01-31', debit: 100 }),
        entry({ id: 3, date: '2023-03-01', debit: 900 }),
      ]);
      const filtered = ledger.whereToDateOrUndated('2023-02-01');

      expect(filtered.getEntries().map((e) => e.id)).toEqual([1, 2]);
      expect(filtered.getClosingBalance()).toBeCloseTo(600, 2);
    });

    it('bounds the dated entries exactly as whereToDate does', () => {
      const entries = [
        entry({ id: 1, date: '2023-01-31' }),
        entry({ id: 2, date: '2023-02-01' }),
        entry({ id: 3, date: '2023-02-02' }),
      ];
      const ledger = new Ledger(entries);

      expect(
        ledger
          .whereToDateOrUndated('2023-02-01')
          .getEntries()
          .map((e) => e.id),
      ).toEqual(
        ledger
          .whereToDate('2023-02-01')
          .getEntries()
          .map((e) => e.id),
      );
    });
  });
});
