import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const INVENTORY_ADJUSTMENTS_ROUTES = {
  LIST: '/api/inventory-adjustments',
  BY_ID: '/api/inventory-adjustments/{id}',
  QUICK: '/api/inventory-adjustments/quick',
  PUBLISH: '/api/inventory-adjustments/{id}/publish',
} as const satisfies Record<string, keyof paths>;

export type InventoryAdjustmentsListResponse = OpResponseBody<OpForPath<typeof INVENTORY_ADJUSTMENTS_ROUTES.LIST, 'get'>>;
export type InventoryAdjustment = OpResponseBody<OpForPath<typeof INVENTORY_ADJUSTMENTS_ROUTES.BY_ID, 'get'>>;
export type CreateQuickInventoryAdjustmentBody = OpRequestBody<OpForPath<typeof INVENTORY_ADJUSTMENTS_ROUTES.QUICK, 'post'>>;
export type EditQuickInventoryAdjustmentBody = OpRequestBody<OpForPath<typeof INVENTORY_ADJUSTMENTS_ROUTES.BY_ID, 'put'>>;
export type GetInventoryAdjustmentsQuery = OpQueryParams<OpForPath<typeof INVENTORY_ADJUSTMENTS_ROUTES.LIST, 'get'>>;

export async function fetchInventoryAdjustments(
  fetcher: ApiFetcher,
  query?: GetInventoryAdjustmentsQuery
): Promise<InventoryAdjustmentsListResponse> {
  const get = fetcher.path(INVENTORY_ADJUSTMENTS_ROUTES.LIST).method('get').create();
  const { data } = await (get as (params?: GetInventoryAdjustmentsQuery) => Promise<{ data: InventoryAdjustmentsListResponse }>)(
    query ?? {}
  );
  return data;
}

export async function fetchInventoryAdjustment(fetcher: ApiFetcher, id: number): Promise<InventoryAdjustment> {
  const get = fetcher.path(INVENTORY_ADJUSTMENTS_ROUTES.BY_ID).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function createQuickInventoryAdjustment(
  fetcher: ApiFetcher,
  values: CreateQuickInventoryAdjustmentBody
): Promise<void> {
  const post = fetcher.path(INVENTORY_ADJUSTMENTS_ROUTES.QUICK).method('post').create();
  await post(values);
}

export async function editQuickInventoryAdjustment(
  fetcher: ApiFetcher,
  id: number,
  values: EditQuickInventoryAdjustmentBody
): Promise<void> {
  const put = fetcher.path(INVENTORY_ADJUSTMENTS_ROUTES.BY_ID).method('put').create();
  await put({ id, ...values });
}

export async function deleteInventoryAdjustment(fetcher: ApiFetcher, id: number): Promise<void> {
  const del = fetcher.path(INVENTORY_ADJUSTMENTS_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}

export async function publishInventoryAdjustment(fetcher: ApiFetcher, id: number): Promise<void> {
  const put = fetcher.path(INVENTORY_ADJUSTMENTS_ROUTES.PUBLISH).method('put').create();
  await put({ id });
}
