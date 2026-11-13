import type { Batch } from '@/hooks/query/batches/queries';

export interface ItemEntryBatchAllocation {
  id?: number;
  batchId: number;
  quantity: number;
  batch?: Batch | null;
}

export interface ItemEntry {
  index: number;
  itemId: number;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  taxRateId: number;
  taxRate: number;
  taxAmount: number;
  /** @deprecated Use `batches` instead. Kept for backwards compatibility. */
  batchId?: number | null;
  /** @deprecated Use `batches` instead. Kept for backwards compatibility. */
  batch?: Batch | null;
  batches?: ItemEntryBatchAllocation[];
}
