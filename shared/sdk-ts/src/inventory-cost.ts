import type { OpArgType } from 'openapi-typescript-fetch';
import type { ApiFetcher } from './fetch-utils';
import { withNestedQuery } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams } from './utils';

export const INVENTORY_COST_ROUTES = {
  ITEMS: '/api/inventory-cost/items',
} as const satisfies Record<string, keyof paths>;

type GetItemsCostOp = OpForPath<typeof INVENTORY_COST_ROUTES.ITEMS, 'get'>;
type GetItemsCostArg = OpArgType<GetItemsCostOp>;

/** Query params for get items inventory cost. */
export type GetInventoryItemsCostQuery = OpQueryParams<GetItemsCostOp>;

export interface InventoryItemCostMeta {
  itemId: number;
  valuation: number;
  quantity: number;
  average: number;
}

export interface GetInventoryItemsCostResponse {
  costs: InventoryItemCostMeta[];
}

export async function fetchInventoryCostItems(
  fetcher: ApiFetcher,
  query: GetInventoryItemsCostQuery
): Promise<GetInventoryItemsCostResponse> {
  const get = fetcher.path(INVENTORY_COST_ROUTES.ITEMS).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as GetItemsCostArg, init);
  return (data ?? { costs: [] }) as GetInventoryItemsCostResponse;
}
