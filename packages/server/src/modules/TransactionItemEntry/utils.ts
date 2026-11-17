import * as moment from 'moment';
import type { DocumentBatchDirection, IDocumentBatch } from './ItemEntry.types';

interface IBatchReference {
  batchNumber?: string | null;
  batchRef?: string | null;
  expiryDate?: string | Date | null;
}

interface IEntryBatchAllocationSource {
  batchId: number;
  quantity: number;
  batch?: IBatchReference | null;
}

interface IEntryBatchMovementSource {
  itemId?: number;
  quantity?: number;
  item?: { name?: string | null } | null;
  batchId?: number | null;
  batch?: IBatchReference | null;
  batches?: IEntryBatchAllocationSource[];
}

/**
 * Converts a batch quantity into a number.
 */
const toBatchQuantity = (value: unknown): number => {
  const quantity = Number(value);
  return Number.isFinite(quantity) ? quantity : 0;
};

/**
 * Formats the given batch date as a calendar date.
 */
const formatBatchDate = (value?: string | Date | null): string | null => {
  return value ? moment(value).format('YYYY-MM-DD') : null;
};

/**
 * Builds the document level batch movements from the given item entries.
 */
export const transformEntriesToDocumentBatches = (
  entries: IEntryBatchMovementSource[],
  direction: DocumentBatchDirection,
): IDocumentBatch[] => {
  return entries.flatMap((entry) => {
    const allocations: IEntryBatchAllocationSource[] = entry.batches?.length
      ? entry.batches
      : entry.batchId
        ? [
            {
              batchId: entry.batchId,
              quantity: toBatchQuantity(entry.quantity),
              batch: entry.batch,
            },
          ]
        : [];

    return allocations.map((allocation) => ({
      batchId: Number(allocation.batchId),
      batchNumber:
        allocation.batch?.batchNumber?.trim() || `#${allocation.batchId}`,
      batchRef: allocation.batch?.batchRef ?? null,
      expiryDate: formatBatchDate(allocation.batch?.expiryDate),
      quantity: toBatchQuantity(allocation.quantity),
      itemId: Number(entry.itemId ?? 0),
      itemName: entry.item?.name?.trim() || '-',
      direction,
    }));
  });
};
