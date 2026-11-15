import type { ItemEntryBatchAllocation } from '@/interfaces/ItemEntries';

interface BatchMovementEntryBatch {
  batchNumber?: string;
  batchRef?: string | null;
  expiryDate?: string | null;
}

export interface BatchMovementEntry {
  index?: number;
  quantity?: number | string;
  item?: { name?: string | null } | null;
  batches?: ItemEntryBatchAllocation[];
  batchId?: number | null;
  batch?: BatchMovementEntryBatch | null;
}

export type BatchMovementDirection = 'in' | 'out';

export interface BatchMovementRow {
  key: string;
  itemName: string;
  batchNumber: string;
  batchRef: string | null;
  expiryDate: string | null;
  quantity: number;
}

/**
 * Converts a batch quantity returned by the API into a number.
 */
const toBatchQuantity = (value: unknown): number => {
  const quantity = Number(value);
  return Number.isFinite(quantity) ? quantity : 0;
};

/**
 * Returns a short human readable summary of the entry batch allocations.
 */
export const getEntryBatchAllocationsSummary = (
  entry: BatchMovementEntry,
): string => {
  if (entry.batches?.length) {
    return entry.batches
      .map((allocation) => {
        const batchNumber =
          allocation.batch?.batchNumber ?? `#${allocation.batchId}`;
        return `${batchNumber} (${allocation.quantity})`;
      })
      .join(', ');
  }
  if (entry.batch?.batchNumber) {
    return entry.batch.batchNumber;
  }
  return '-';
};

/**
 * Builds the batch movement rows of the given document entries. The sale
 * invoice entries consume batches while the bill entries receive them, so the
 * direction is only used to keep the row keys unique.
 */
export const getEntriesBatchMovements = (
  entries: BatchMovementEntry[],
  direction: BatchMovementDirection,
): BatchMovementRow[] => {
  return entries.flatMap((entry, entryIndex) => {
    const allocations: ItemEntryBatchAllocation[] = entry.batches?.length
      ? entry.batches
      : entry.batchId
        ? [
            {
              batchId: entry.batchId,
              quantity: toBatchQuantity(entry.quantity),
              batch: entry.batch as ItemEntryBatchAllocation['batch'],
            },
          ]
        : [];

    return allocations.map((allocation, allocationIndex) => ({
      key: `${direction}-${entry.index ?? entryIndex}-${allocation.batchId}-${allocationIndex}`,
      itemName: entry.item?.name?.trim() || '-',
      batchNumber:
        allocation.batch?.batchNumber?.trim() || `#${allocation.batchId}`,
      batchRef: allocation.batch?.batchRef ?? null,
      expiryDate: allocation.batch?.expiryDate ?? null,
      quantity: toBatchQuantity(allocation.quantity),
    }));
  });
};
