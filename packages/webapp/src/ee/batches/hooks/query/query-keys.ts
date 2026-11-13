export const BATCHES = 'BATCHES';
export const BATCH = 'BATCH';
export const ITEM_BATCHES = 'ITEM_BATCHES';
export const ITEM_AVAILABLE_BATCHES = 'ITEM_AVAILABLE_BATCHES';
export const BATCH_DETAILS_REPORT = 'BATCH_DETAILS_REPORT';

export const batchesKeys = {
  all: () => [BATCHES] as const,
  list: (query?: Record<string, unknown>) => [BATCHES, query] as const,
  detail: (id: number | null | undefined) => [BATCH, id] as const,
  itemBatches: (itemId: number | null | undefined) =>
    [ITEM_BATCHES, itemId] as const,
  availableBatches: (itemId: number | null | undefined) =>
    [ITEM_AVAILABLE_BATCHES, itemId] as const,
  report: (query?: Record<string, unknown>) =>
    [BATCH_DETAILS_REPORT, query] as const,
  reportAll: () => [BATCH_DETAILS_REPORT] as const,
};
