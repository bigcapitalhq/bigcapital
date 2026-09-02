/**
 * Shared chronological ordering for inventory cost replay.
 * Same-day: IN before OUT; InventoryAdjustment before other INs; then createdAt.
 */
export interface CostReplayOrderable {
  date: Date | string;
  direction: string;
  transactionType?: string;
  createdAt?: Date | string;
}

const directionRank = (direction: string) => (direction === 'IN' ? 0 : 1);

const transactionTypeRank = (transactionType?: string) =>
  transactionType === 'InventoryAdjustment' ? 0 : 1;

const compareCreatedAt = (
  a: Date | string | undefined,
  b: Date | string | undefined,
) => String(a ?? '').localeCompare(String(b ?? ''));

export const compareInventoryTransactionsForCostReplay = (
  a: CostReplayOrderable,
  b: CostReplayOrderable,
): number => {
  const dateCompare = String(a.date).localeCompare(String(b.date));
  if (dateCompare !== 0) {
    return dateCompare;
  }

  const directionCompare =
    directionRank(a.direction) - directionRank(b.direction);
  if (directionCompare !== 0) {
    return directionCompare;
  }

  const typeCompare =
    transactionTypeRank(a.transactionType) -
    transactionTypeRank(b.transactionType);
  if (typeCompare !== 0) {
    return typeCompare;
  }

  return compareCreatedAt(a.createdAt, b.createdAt);
};

export const sortInventoryTransactionsForCostReplay = <
  T extends CostReplayOrderable,
>(
  transactions: T[],
): T[] => [...transactions].sort(compareInventoryTransactionsForCostReplay);

export const applyCostTransactionOrder = (query: any) =>
  query
    .orderBy('date', 'ASC')
    .orderByRaw("FIELD(direction, 'IN', 'OUT')")
    .orderByRaw(
      `CASE WHEN transaction_type = 'InventoryAdjustment' THEN 0 ELSE 1 END`,
    )
    .orderBy('createdAt', 'ASC');
