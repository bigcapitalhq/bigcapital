import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const WAREHOUSE_TRANSFERS_ROUTES = {
  LIST: '/api/warehouse-transfers',
  BY_ID: '/api/warehouse-transfers/{id}',
  INITIATE: '/api/warehouse-transfers/{id}/initiate',
  TRANSFERRED: '/api/warehouse-transfers/{id}/transferred',
  VALIDATE_BULK_DELETE: '/api/warehouse-transfers/validate-bulk-delete',
  BULK_DELETE: '/api/warehouse-transfers/bulk-delete',
} as const satisfies Record<string, keyof paths>;

export type WarehouseTransfersListResponse = OpResponseBody<OpForPath<typeof WAREHOUSE_TRANSFERS_ROUTES.LIST, 'get'>>;
export type WarehouseTransfer = OpResponseBody<OpForPath<typeof WAREHOUSE_TRANSFERS_ROUTES.BY_ID, 'get'>>;
export type CreateWarehouseTransferBody = OpRequestBody<OpForPath<typeof WAREHOUSE_TRANSFERS_ROUTES.LIST, 'post'>>;
export type EditWarehouseTransferBody = OpRequestBody<OpForPath<typeof WAREHOUSE_TRANSFERS_ROUTES.BY_ID, 'put'>>;
export type GetWarehouseTransfersQuery = OpQueryParams<OpForPath<typeof WAREHOUSE_TRANSFERS_ROUTES.LIST, 'get'>>;

export async function fetchWarehouseTransfers(
  fetcher: ApiFetcher,
  query?: GetWarehouseTransfersQuery
): Promise<WarehouseTransfersListResponse> {
  const get = fetcher.path(WAREHOUSE_TRANSFERS_ROUTES.LIST).method('get').create();
  const { data } = await (get as (params: GetWarehouseTransfersQuery) => Promise<{ data: WarehouseTransfersListResponse }>)(
    query ?? {}
  );
  return data;
}

export async function fetchWarehouseTransfer(fetcher: ApiFetcher, id: number): Promise<WarehouseTransfer> {
  const get = fetcher.path(WAREHOUSE_TRANSFERS_ROUTES.BY_ID).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function createWarehouseTransfer(
  fetcher: ApiFetcher,
  values: CreateWarehouseTransferBody
): Promise<void> {
  const post = fetcher.path(WAREHOUSE_TRANSFERS_ROUTES.LIST).method('post').create();
  await post(values);
}

export async function editWarehouseTransfer(
  fetcher: ApiFetcher,
  id: number,
  values: EditWarehouseTransferBody
): Promise<void> {
  const put = fetcher.path(WAREHOUSE_TRANSFERS_ROUTES.BY_ID).method('put').create();
  await put({ id, ...(values as object) } as never);
}

export async function deleteWarehouseTransfer(fetcher: ApiFetcher, id: number): Promise<void> {
  const del = fetcher.path(WAREHOUSE_TRANSFERS_ROUTES.BY_ID).method('delete').create();
  await (del as unknown as (params: { id: number }) => Promise<void>)({ id });
}

export async function initiateWarehouseTransfer(fetcher: ApiFetcher, id: number): Promise<void> {
  const put = fetcher.path(WAREHOUSE_TRANSFERS_ROUTES.INITIATE).method('put').create();
  await (put as unknown as (params: { id: number }) => Promise<void>)({ id });
}

export async function transferredWarehouseTransfer(fetcher: ApiFetcher, id: number): Promise<void> {
  const put = fetcher.path(WAREHOUSE_TRANSFERS_ROUTES.TRANSFERRED).method('put').create();
  await (put as unknown as (params: { id: number }) => Promise<void>)({ id });
}

export type BulkDeleteWarehouseTransfersBody = {
  ids: number[];
  skipUndeletable?: boolean;
};
export type ValidateBulkDeleteWarehouseTransfersResponse = {
  deletableCount: number;
  nonDeletableCount: number;
  deletableIds: number[];
  nonDeletableIds: number[];
};

export async function bulkDeleteWarehouseTransfers(
  fetcher: ApiFetcher,
  body: BulkDeleteWarehouseTransfersBody
): Promise<void> {
  const post = fetcher.path(WAREHOUSE_TRANSFERS_ROUTES.BULK_DELETE).method('post').create();
  await post({ ids: body.ids, skipUndeletable: body.skipUndeletable ?? false } as never);
}

export async function validateBulkDeleteWarehouseTransfers(
  fetcher: ApiFetcher,
  ids: number[]
): Promise<ValidateBulkDeleteWarehouseTransfersResponse> {
  const post = fetcher.path(WAREHOUSE_TRANSFERS_ROUTES.VALIDATE_BULK_DELETE).method('post').create();
  const { data } = await post({ ids, skipUndeletable: false } as never);
  return data as ValidateBulkDeleteWarehouseTransfersResponse;
}
