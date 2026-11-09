export interface IReorderPointInventoryTransaction {
  itemId: number | string;
  direction: 'IN' | 'OUT';
  quantity: number | string | null;
}

/**
 * Returns the item ids whose total on-hand quantity changed by the given
 * inventory transactions. Zero-net movements (e.g. warehouse transfers) and
 * cost-only movements are ignored.
 * @param {IReorderPointInventoryTransaction[]} transactions
 * @returns {number[]}
 */
export function getChangedInventoryItemIds(
  transactions: IReorderPointInventoryTransaction[],
): number[] {
  if (!Array.isArray(transactions)) {
    return [];
  }
  const netChanges = new Map<number, number>();

  transactions.forEach((transaction) => {
    if (transaction.quantity === null || transaction.quantity === undefined) {
      return;
    }
    const itemId = Number(transaction.itemId);
    const quantity = Number(transaction.quantity);

    if (!Number.isFinite(itemId) || !Number.isFinite(quantity)) {
      return;
    }
    const change = transaction.direction === 'IN' ? quantity : -quantity;

    netChanges.set(itemId, (netChanges.get(itemId) ?? 0) + change);
  });

  return [...netChanges.entries()]
    .filter(([, change]) => Number(change.toFixed(3)) !== 0)
    .map(([itemId]) => itemId);
}

/**
 * Normalizes a numeric database value.
 * @param {unknown} value
 * @returns {number | null}
 */
export function normalizeReorderPointValue(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}
