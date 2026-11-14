import type { ApiFetcher } from "../fetch-utils";
import { paths } from "../schema";
import { OpForPath, OpRequestBody, OpResponseBody } from "../utils";

export const BATCHES_ROUTES = {
  LIST: "/api/batches",
  AVAILABLE: "/api/batches/available",
  BY_ID: "/api/batches/{id}",
  BULK_SAVE: "/api/batches/bulk",
} as const satisfies Record<string, keyof paths>;

export type BulkSaveBatchesBody = OpRequestBody<
  OpForPath<typeof BATCHES_ROUTES.BULK_SAVE, "put">
>;
export type BulkSaveBatchItem = BulkSaveBatchesBody["batches"][number];
export type BulkSaveBatchesResponse = OpResponseBody<
  OpForPath<typeof BATCHES_ROUTES.BULK_SAVE, "put">
>;

/**
 * Creates or updates multiple batches in a single request.
 */
export async function bulkSaveBatches(
  fetcher: ApiFetcher,
  values: BulkSaveBatchesBody,
): Promise<BulkSaveBatchesResponse> {
  const put = fetcher.path(BATCHES_ROUTES.BULK_SAVE).method("put").create();
  const { data } = await put(values);
  return data;
}
