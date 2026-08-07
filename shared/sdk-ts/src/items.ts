import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const ITEMS_ROUTES = {
  LIST: '/api/items',
  BY_ID: '/api/items/{id}',
  VALIDATE_BULK_DELETE: '/api/items/validate-bulk-delete',
  BULK_DELETE: '/api/items/bulk-delete',
  INACTIVATE: '/api/items/{id}/inactivate',
  ACTIVATE: '/api/items/{id}/activate',
  INVOICES: '/api/items/{id}/invoices',
  BILLS: '/api/items/{id}/bills',
  ESTIMATES: '/api/items/{id}/estimates',
  RECEIPTS: '/api/items/{id}/receipts',
  WAREHOUSES: '/api/items/{id}/warehouses',
} as const satisfies Record<string, keyof paths>;

export type ItemsListResponse = OpResponseBody<OpForPath<typeof ITEMS_ROUTES.LIST, 'get'>>;
export type Item = OpResponseBody<OpForPath<typeof ITEMS_ROUTES.BY_ID, 'get'>>;
export type CreateItemBody = OpRequestBody<OpForPath<typeof ITEMS_ROUTES.LIST, 'post'>>;
export type EditItemBody = OpRequestBody<OpForPath<typeof ITEMS_ROUTES.BY_ID, 'put'>>;
export type BulkDeleteItemsBody = OpRequestBody<OpForPath<typeof ITEMS_ROUTES.BULK_DELETE, 'post'>>;
export type ValidateBulkDeleteItemsResponse = OpResponseBody<OpForPath<typeof ITEMS_ROUTES.VALIDATE_BULK_DELETE, 'post'>>;
export type GetItemsQuery = OpQueryParams<OpForPath<typeof ITEMS_ROUTES.LIST, 'get'>>;

export type ItemAssociatedInvoicesResponse = OpResponseBody<OpForPath<typeof ITEMS_ROUTES.INVOICES, 'get'>>;
export type ItemAssociatedBillsResponse = OpResponseBody<OpForPath<typeof ITEMS_ROUTES.BILLS, 'get'>>;
export type ItemAssociatedEstimatesResponse = OpResponseBody<OpForPath<typeof ITEMS_ROUTES.ESTIMATES, 'get'>>;
export type ItemAssociatedReceiptsResponse = OpResponseBody<OpForPath<typeof ITEMS_ROUTES.RECEIPTS, 'get'>>;
export type ItemWarehousesResponse = OpResponseBody<OpForPath<typeof ITEMS_ROUTES.WAREHOUSES, 'get'>>;

export async function fetchItems(
  fetcher: ApiFetcher,
  query?: GetItemsQuery
): Promise<ItemsListResponse> {
  const get = fetcher.path(ITEMS_ROUTES.LIST).method('get').create();
  const { data } = await (get as (params?: GetItemsQuery) => Promise<{ data: ItemsListResponse }>)(
    query ?? {}
  );
  return data;
}

export async function fetchItem(fetcher: ApiFetcher, id: number): Promise<Item> {
  const get = fetcher.path(ITEMS_ROUTES.BY_ID).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function createItem(
  fetcher: ApiFetcher,
  values: CreateItemBody
): Promise<void> {
  const post = fetcher.path(ITEMS_ROUTES.LIST).method('post').create();
  await post(values);
}

export async function editItem(
  fetcher: ApiFetcher,
  id: number,
  values: EditItemBody
): Promise<void> {
  const put = fetcher.path(ITEMS_ROUTES.BY_ID).method('put').create();
  await put({ id, ...values });
}

export async function deleteItem(fetcher: ApiFetcher, id: number): Promise<void> {
  const del = fetcher.path(ITEMS_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}

export async function inactivateItem(fetcher: ApiFetcher, id: number): Promise<void> {
  const patch = fetcher.path(ITEMS_ROUTES.INACTIVATE).method('patch').create();
  await patch({ id });
}

export async function activateItem(fetcher: ApiFetcher, id: number): Promise<void> {
  const patch = fetcher.path(ITEMS_ROUTES.ACTIVATE).method('patch').create();
  await patch({ id });
}

export async function validateBulkDeleteItems(
  fetcher: ApiFetcher,
  body: BulkDeleteItemsBody
): Promise<ValidateBulkDeleteItemsResponse> {
  const validate = fetcher.path(ITEMS_ROUTES.VALIDATE_BULK_DELETE).method('post').create();
  const { data } = await validate(body);
  return data;
}

export async function bulkDeleteItems(
  fetcher: ApiFetcher,
  body: BulkDeleteItemsBody
): Promise<void> {
  const post = fetcher.path(ITEMS_ROUTES.BULK_DELETE).method('post').create();
  await post(body);
}

export async function fetchItemInvoices(
  fetcher: ApiFetcher,
  id: number,
): Promise<ItemAssociatedInvoicesResponse> {
  const get = fetcher.path(ITEMS_ROUTES.INVOICES).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function fetchItemBills(
  fetcher: ApiFetcher,
  id: number,
): Promise<ItemAssociatedBillsResponse> {
  const get = fetcher.path(ITEMS_ROUTES.BILLS).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function fetchItemEstimates(
  fetcher: ApiFetcher,
  id: number,
): Promise<ItemAssociatedEstimatesResponse> {
  const get = fetcher.path(ITEMS_ROUTES.ESTIMATES).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function fetchItemReceipts(
  fetcher: ApiFetcher,
  id: number,
): Promise<ItemAssociatedReceiptsResponse> {
  const get = fetcher.path(ITEMS_ROUTES.RECEIPTS).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function fetchItemWarehouses(
  fetcher: ApiFetcher,
  id: number,
): Promise<ItemWarehousesResponse> {
  const get = fetcher.path(ITEMS_ROUTES.WAREHOUSES).method('get').create();
  const { data } = await get({ id });
  return data;
}
