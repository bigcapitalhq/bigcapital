import {
  AgingDocumentInput,
  getAgingDocumentsAsOf,
  toDateKey,
  writeoffSettlementRows,
} from './AgingAsOf';

const D = '2025-12-31';

const doc = (data: Partial<AgingDocumentInput> = {}): AgingDocumentInput => ({
  id: 1,
  contactId: 1,
  total: 1000,
  exchangeRate: 1,
  documentDate: '2025-12-01',
  dueDate: '2025-12-31',
  ...data,
});

describe('AgingAsOf', () => {
  describe('toDateKey', () => {
    it('keeps the calendar day of a local-midnight Date', () => {
      expect(toDateKey(new Date(2025, 11, 31))).toBe('2025-12-31');
      expect(toDateKey('2025-12-31')).toBe('2025-12-31');
    });
  });

  describe('which settlements count', () => {
    it('ignores a settlement dated after the as-of date', () => {
      const result = getAgingDocumentsAsOf(
        [doc()],
        [{ documentId: 1, amount: 1000, date: '2026-01-15' }],
        D,
      );
      expect(result.current).toEqual([
        { id: 1, contactId: 1, dueAmountLocal: 1000, overdueDays: 0 },
      ]);
      expect(result.overdue).toEqual([]);
    });

    it('counts a settlement dated on the as-of date', () => {
      const result = getAgingDocumentsAsOf(
        [doc()],
        [{ documentId: 1, amount: 1000, date: '2025-12-31' }],
        D,
      );
      expect(result.current).toEqual([]);
      expect(result.overdue).toEqual([]);
    });

    it('keeps the open remainder of earlier settlements', () => {
      const result = getAgingDocumentsAsOf(
        [doc({ total: 500 })],
        [
          { documentId: 1, amount: 100, date: '2025-12-10' },
          { documentId: 1, amount: 100, date: '2025-12-20' },
          { documentId: 1, amount: 200, date: '2026-01-15' },
        ],
        D,
      );
      expect(result.current[0].dueAmountLocal).toBe(300);
    });

    it("keeps each document's settlements apart", () => {
      const result = getAgingDocumentsAsOf(
        [doc({ id: 1 }), doc({ id: 2 })],
        [{ documentId: 2, amount: 1000, date: '2025-12-20' }],
        D,
      );
      expect(result.current.map((d) => d.id)).toEqual([1]);
    });

    it('drops a document whose open amount rounds to zero', () => {
      const result = getAgingDocumentsAsOf(
        [doc({ total: 37.94 })],
        [
          { documentId: 1, amount: 12, date: '2025-12-01' },
          { documentId: 1, amount: 25.94, date: '2025-12-01' },
        ],
        D,
      );
      expect(result.current).toEqual([]);
      expect(result.overdue).toEqual([]);
    });
  });

  describe('current vs. overdue', () => {
    it('treats a due date equal to the as-of date as current', () => {
      const result = getAgingDocumentsAsOf(
        [doc({ dueDate: '2025-12-31' })],
        [],
        D,
      );
      expect(result.current.length).toBe(1);
      expect(result.overdue.length).toBe(0);
    });

    it('counts overdue days from the as-of date', () => {
      const result = getAgingDocumentsAsOf(
        [doc({ dueDate: '2025-12-15' })],
        [],
        D,
      );
      expect(result.current.length).toBe(0);
      expect(result.overdue[0].overdueDays).toBe(16);
    });

    it('ages a document with no due date from its document date', () => {
      const old = getAgingDocumentsAsOf(
        [doc({ dueDate: null, documentDate: '2025-12-01' })],
        [],
        D,
      );
      expect(old.overdue[0].overdueDays).toBe(30);

      const sameDay = getAgingDocumentsAsOf(
        [doc({ dueDate: null, documentDate: '2025-12-31' })],
        [],
        D,
      );
      expect(sameDay.current.length).toBe(1);
    });
  });

  describe('currency and input formats', () => {
    it('converts the open amount with the exchange rate', () => {
      const converted = getAgingDocumentsAsOf(
        [doc({ total: 100, exchangeRate: 1.5 })],
        [],
        D,
      );
      expect(converted.current[0].dueAmountLocal).toBe(150);

      const noRate = getAgingDocumentsAsOf(
        [doc({ total: 100, exchangeRate: null })],
        [],
        D,
      );
      expect(noRate.current[0].dueAmountLocal).toBe(100);
    });

    it('accepts Date objects at local midnight', () => {
      const result = getAgingDocumentsAsOf(
        [
          doc({
            documentDate: new Date(2025, 11, 1),
            dueDate: new Date(2025, 11, 15),
          }),
        ],
        [{ documentId: 1, amount: 1000, date: new Date(2026, 0, 15) }],
        D,
      );
      expect(result.overdue[0]).toMatchObject({
        dueAmountLocal: 1000,
        overdueDays: 16,
      });
    });
  });

  describe('write-offs', () => {
    it('ignores a write-off made after the as-of date', () => {
      const later = getAgingDocumentsAsOf(
        [doc()],
        writeoffSettlementRows([
          { id: 1, writtenoffAmount: 1000, writtenoffAt: '2026-11-05' },
        ]),
        D,
      );
      expect(later.current[0].dueAmountLocal).toBe(1000);

      const earlier = getAgingDocumentsAsOf(
        [doc()],
        writeoffSettlementRows([
          { id: 1, writtenoffAmount: 1000, writtenoffAt: '2025-12-20' },
        ]),
        D,
      );
      expect(earlier.current).toEqual([]);
      expect(earlier.overdue).toEqual([]);
    });

    it("skips invoices that aren't written off", () => {
      expect(
        writeoffSettlementRows([
          { id: 1, writtenoffAmount: null, writtenoffAt: null },
        ]),
      ).toEqual([]);
    });
  });
});
