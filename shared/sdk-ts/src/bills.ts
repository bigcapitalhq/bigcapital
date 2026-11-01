import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const BILLS_ROUTES = {
  LIST: '/api/bills',
  BY_ID: '/api/bills/{id}',
  PAYMENT_TRANSACTIONS: '/api/bills/{id}/payment-transactions',
  OPEN: '/api/bills/{id}/open',
  DUE: '/api/bills/due',
  VALIDATE_BULK_DELETE: '/api/bills/validate-bulk-delete',
  BULK_DELETE: '/api/bills/bulk-delete',
} as const satisfies Record<string, keyof paths>;

export type BillsListResponse = OpResponseBody<OpForPath<typeof BILLS_ROUTES.LIST, 'get'>>;
export type Bill = OpResponseBody<OpForPath<typeof BILLS_ROUTES.BY_ID, 'get'>>;
export type CreateBillBody = OpRequestBody<OpForPath<typeof BILLS_ROUTES.LIST, 'post'>>;
export type EditBillBody = OpRequestBody<OpForPath<typeof BILLS_ROUTES.BY_ID, 'put'>>;
export type GetBillsQuery = OpQueryParams<OpForPath<typeof BILLS_ROUTES.LIST, 'get'>>;
export type BulkDeleteBillsBody = OpRequestBody<OpForPath<typeof BILLS_ROUTES.BULK_DELETE, 'post'>>;
export type ValidateBulkDeleteBillsResponse = OpResponseBody<
  OpForPath<typeof BILLS_ROUTES.VALIDATE_BULK_DELETE, 'post'>
>;
export type GetDueBillsQuery = OpQueryParams<OpForPath<typeof BILLS_ROUTES.DUE, 'get'>>;
export type BillPaymentTransactionsResponse = OpResponseBody<OpForPath<typeof BILLS_ROUTES.PAYMENT_TRANSACTIONS, 'get'>>;

export async function fetchBills(
  fetcher: ApiFetcher,
  query?: GetBillsQuery
): Promise<BillsListResponse> {
  const get = fetcher.path(BILLS_ROUTES.LIST).method('get').create();
  const { data } = await (
    get as unknown as (params?: GetBillsQuery) => Promise<{ data: BillsListResponse }>
  )(query ?? {});
  return data;
}

export async function fetchBill(fetcher: ApiFetcher, id: number): Promise<Bill> {
  const get = fetcher.path(BILLS_ROUTES.BY_ID).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function createBill(
  fetcher: ApiFetcher,
  values: CreateBillBody
): Promise<void> {
  const post = fetcher.path(BILLS_ROUTES.LIST).method('post').create();
  await post(values);
}

export async function editBill(
  fetcher: ApiFetcher,
  id: number,
  values: EditBillBody
): Promise<void> {
  const put = fetcher.path(BILLS_ROUTES.BY_ID).method('put').create();
  await put({ id, ...values });
}

export async function deleteBill(fetcher: ApiFetcher, id: number): Promise<void> {
  const del = fetcher.path(BILLS_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}

export async function openBill(fetcher: ApiFetcher, id: number): Promise<void> {
  const patch = fetcher.path(BILLS_ROUTES.OPEN).method('patch').create();
  await patch({ id });
}

export async function bulkDeleteBills(
  fetcher: ApiFetcher,
  body: BulkDeleteBillsBody
): Promise<void> {
  const post = fetcher.path(BILLS_ROUTES.BULK_DELETE).method('post').create();
  await post(body);
}

export async function validateBulkDeleteBills(
  fetcher: ApiFetcher,
  body: BulkDeleteBillsBody
): Promise<ValidateBulkDeleteBillsResponse> {
  const post = fetcher
    .path(BILLS_ROUTES.VALIDATE_BULK_DELETE)
    .method('post')
    .create();
  const { data } = await post(body);
  return data;
}

export async function fetchDueBills(
  fetcher: ApiFetcher,
  query?: GetDueBillsQuery
): Promise<unknown[]> {
  const get = fetcher.path(BILLS_ROUTES.DUE).method('get').create();
  const { data } = await (get as (params?: GetDueBillsQuery) => Promise<{ data: unknown }>)(
    (query ?? {}) as GetDueBillsQuery
  );
  return Array.isArray(data) ? data : [];
}

export async function fetchBillPaymentTransactions(
  fetcher: ApiFetcher,
  id: number
): Promise<BillPaymentTransactionsResponse> {
  const get = fetcher
    .path(BILLS_ROUTES.PAYMENT_TRANSACTIONS)
    .method('get')
    .create();
  const { data } = await get({ id });
  return data;
}
