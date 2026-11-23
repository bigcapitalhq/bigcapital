import {
  getChangedInventoryItemIds,
  normalizeReorderPointValue,
} from './ItemReorderPoints.utils';

describe('ItemReorderPoints utils', () => {
  it('returns item ids with a net quantity change', () => {
    const itemIds = getChangedInventoryItemIds([
      { itemId: 1, direction: 'OUT', quantity: 5 },
      { itemId: 2, direction: 'IN', quantity: 3 },
      { itemId: 1, direction: 'IN', quantity: 2 },
    ]);

    expect(itemIds).toEqual([1, 2]);
  });

  it('ignores cost-only and zero-net movements', () => {
    const itemIds = getChangedInventoryItemIds([
      { itemId: 1, direction: 'IN', quantity: null },
      { itemId: 2, direction: 'OUT', quantity: 4 },
      { itemId: 2, direction: 'IN', quantity: 4 },
    ]);

    expect(itemIds).toEqual([]);
  });

  it('normalizes numeric values', () => {
    expect(normalizeReorderPointValue('12.500')).toBe(12.5);
    expect(normalizeReorderPointValue(0)).toBe(0);
    expect(normalizeReorderPointValue(null)).toBeNull();
    expect(normalizeReorderPointValue('')).toBeNull();
    expect(normalizeReorderPointValue('not-a-number')).toBeNull();
  });
});
