import { aggregate } from './_utils';

describe('aggregate', () => {
  describe('basic aggregation', () => {
    it('should aggregate entries with matching comparator attribute', () => {
      const input = [
        { id: 1, name: 'John', entries: ['entry1'] },
        { id: 2, name: 'Jane', entries: ['entry2'] },
        { id: 1, name: 'John', entries: ['entry3'] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        name: 'John',
        entries: ['entry1', 'entry3'],
      });
      expect(result[1]).toEqual({
        id: 2,
        name: 'Jane',
        entries: ['entry2'],
      });
    });

    it('should preserve order of first occurrence', () => {
      const input = [
        { id: 2, entries: ['a'] },
        { id: 1, entries: ['b'] },
        { id: 2, entries: ['c'] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result[0].id).toBe(2);
      expect(result[1].id).toBe(1);
    });
  });

  describe('no matching entries', () => {
    it('should return all entries unchanged when no comparator matches', () => {
      const input = [
        { id: 1, name: 'John', entries: ['entry1'] },
        { id: 2, name: 'Jane', entries: ['entry2'] },
        { id: 3, name: 'Bob', entries: ['entry3'] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(3);
      expect(result).toEqual(input);
    });
  });

  describe('edge cases', () => {
    it('should return empty array when input is empty', () => {
      const result = aggregate([], 'id', 'entries');

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return single entry unchanged when input has one item', () => {
      const input = [{ id: 1, name: 'John', entries: ['entry1'] }];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        name: 'John',
        entries: ['entry1'],
      });
    });

    it('should handle multiple entries with same comparator value', () => {
      const input = [
        { id: 1, entries: ['a'] },
        { id: 1, entries: ['b'] },
        { id: 1, entries: ['c'] },
        { id: 1, entries: ['d'] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(1);
      expect(result[0].entries).toEqual(['a', 'b', 'c', 'd']);
    });
  });

  describe('different comparator attributes', () => {
    it('should work with string comparator attribute', () => {
      const input = [
        { name: 'Product A', category: 'Electronics', entries: ['item1'] },
        { name: 'Product B', category: 'Books', entries: ['item2'] },
        { name: 'Product C', category: 'Electronics', entries: ['item3'] },
      ];

      const result = aggregate(input, 'category', 'entries');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: 'Product A',
        category: 'Electronics',
        entries: ['item1', 'item3'],
      });
      expect(result[1]).toEqual({
        name: 'Product B',
        category: 'Books',
        entries: ['item2'],
      });
    });

    it('should not aggregate items with undefined comparator values', () => {
      const input = [
        { id: undefined, entries: ['a'] },
        { id: 1, entries: ['b'] },
        { id: undefined, entries: ['c'] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(3);
      // Items with undefined id are NOT aggregated - each remains separate
      expect(result[0].entries).toEqual(['a']);
      expect(result[1].entries).toEqual(['b']);
      expect(result[2].entries).toEqual(['c']);
    });

    it('should handle null comparator values separately', () => {
      const input = [
        { id: null, entries: ['a'] },
        { id: 1, entries: ['b'] },
        { id: null, entries: ['c'] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(3);
      expect(result[0].entries).toEqual(['a']);
      expect(result[1].entries).toEqual(['b']);
      expect(result[2].entries).toEqual(['c']);
    });

    it('should not aggregate items missing the comparatorAttr property', () => {
      const input = [
        { id: 1, entries: ['a'] },
        { name: 'No ID', entries: ['b'] }, // missing 'id' property
        { id: 1, entries: ['c'] },
        { entries: ['d'] }, // also missing 'id' property
      ];

      const result = aggregate(input, 'id', 'entries');

      // 3 entries: aggregated id:1, and two separate items without 'id' property
      expect(result).toHaveLength(3);
      // Items with id: 1 are aggregated
      expect(result[0]).toEqual({ id: 1, entries: ['a', 'c'] });
      // Items missing 'id' are NOT aggregated - each remains separate
      expect(result[1]).toEqual({ name: 'No ID', entries: ['b'] });
      expect(result[2]).toEqual({ entries: ['d'] });
    });
  });

  describe('different group attributes', () => {
    it('should work with different groupOn attribute name', () => {
      const input = [
        { id: 1, items: ['item1'] },
        { id: 1, items: ['item2'] },
        { id: 2, items: ['item3'] },
      ];

      const result = aggregate(input, 'id', 'items');

      expect(result).toHaveLength(2);
      expect(result[0].items).toEqual(['item1', 'item2']);
      expect(result[1].items).toEqual(['item3']);
    });
  });

  describe('complex entries', () => {
    it('should aggregate entries containing objects', () => {
      const input = [
        { invoiceId: 'INV-001', entries: [{ itemId: 1, quantity: 2 }] },
        { invoiceId: 'INV-002', entries: [{ itemId: 2, quantity: 1 }] },
        { invoiceId: 'INV-001', entries: [{ itemId: 3, quantity: 5 }] },
      ];

      const result = aggregate(input, 'invoiceId', 'entries');

      expect(result).toHaveLength(2);
      expect(result[0].entries).toEqual([
        { itemId: 1, quantity: 2 },
        { itemId: 3, quantity: 5 },
      ]);
      expect(result[1].entries).toEqual([{ itemId: 2, quantity: 1 }]);
    });

    it('should aggregate entries with multiple items in each entry', () => {
      const input = [
        { id: 1, entries: ['a', 'b'] },
        { id: 1, entries: ['c', 'd'] },
        { id: 2, entries: ['e'] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(2);
      expect(result[0].entries).toEqual(['a', 'b', 'c', 'd']);
      expect(result[1].entries).toEqual(['e']);
    });
  });

  describe('numeric comparator values', () => {
    it('should correctly compare numeric values', () => {
      const input = [
        { id: 1, entries: ['a'] },
        { id: 2, entries: ['b'] },
        { id: 1, entries: ['c'] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(2);
      expect(result.find((r) => r.id === 1).entries).toEqual(['a', 'c']);
      expect(result.find((r) => r.id === 2).entries).toEqual(['b']);
    });

    it('should treat 0 as a valid comparator value', () => {
      const input = [
        { id: 0, entries: ['a'] },
        { id: 1, entries: ['b'] },
        { id: 0, entries: ['c'] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(2);
      expect(result[0].entries).toEqual(['a', 'c']);
      expect(result[1].entries).toEqual(['b']);
    });
  });

  describe('preserving other properties', () => {
    it('should preserve all properties from the first matching entry', () => {
      const input = [
        { id: 1, name: 'First', extra: 'data1', entries: ['a'] },
        { id: 1, name: 'Second', extra: 'data2', entries: ['b'] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('First');
      expect(result[0].extra).toBe('data1');
      expect(result[0].entries).toEqual(['a', 'b']);
    });
  });

  describe('empty entries arrays', () => {
    it('should handle empty entries arrays', () => {
      const input = [
        { id: 1, entries: [] },
        { id: 1, entries: ['a'] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(1);
      expect(result[0].entries).toEqual(['a']);
    });

    it('should handle all empty entries arrays', () => {
      const input = [
        { id: 1, entries: [] },
        { id: 1, entries: [] },
      ];

      const result = aggregate(input, 'id', 'entries');

      expect(result).toHaveLength(1);
      expect(result[0].entries).toEqual([]);
    });
  });
});

