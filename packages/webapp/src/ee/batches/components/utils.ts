import type { ItemEntryBatchAllocation } from '@/interfaces/ItemEntries';

interface EntryBatchAllocationsSummarySource {
  batches?: ItemEntryBatchAllocation[];
  batchId?: number | null;
  batch?: { batchNumber?: string | null } | null;
}

export type BatchMovementDirection = 'in' | 'out';

export interface BatchMovementRow {
  batchId: number;
  batchNumber: string;
  batchRef?: string | null;
  expiryDate?: string | null;
  quantity: number;
  itemId: number;
  itemName: string;
  direction: BatchMovementDirection;
}

/**
 * Returns a short human readable summary of the entry batch allocations.
 */
export const getEntryBatchAllocationsSummary = (
  entry: EntryBatchAllocationsSummarySource,
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
