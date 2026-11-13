import type { ItemEntryBatchAllocation } from '@/interfaces/ItemEntries';

interface EntryWithBatchAllocations {
  batches?: ItemEntryBatchAllocation[];
  batchId?: number | null;
  batch?: { batchNumber?: string } | null;
}

/**
 * Returns a short human readable summary of the entry batch allocations.
 */
export const getEntryBatchAllocationsSummary = (
  entry: EntryWithBatchAllocations,
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
