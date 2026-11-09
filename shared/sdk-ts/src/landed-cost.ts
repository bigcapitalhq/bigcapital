import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const LANDED_COST_ROUTES = {
  TRANSACTIONS: '/api/landed-cost/transactions',
  ALLOCATE: '/api/landed-cost/bills/{billId}/allocate',
  BY_ID: '/api/landed-cost/{allocatedLandedCostId}',
  BILL_TRANSACTIONS: '/api/landed-cost/bills/{billId}/transactions',
} as const satisfies Record<string, keyof paths>;

export type LandedCostTransactionsResponse = OpResponseBody<OpForPath<typeof LANDED_COST_ROUTES.TRANSACTIONS, 'get'>>;
export type GetLandedCostTransactionsQuery = OpQueryParams<OpForPath<typeof LANDED_COST_ROUTES.TRANSACTIONS, 'get'>>;
export type AllocateLandedCostBody = OpRequestBody<OpForPath<typeof LANDED_COST_ROUTES.ALLOCATE, 'post'>>;
export type BillLandedCostTransactionsResponse = OpResponseBody<
  OpForPath<typeof LANDED_COST_ROUTES.BILL_TRANSACTIONS, 'get'>
>;
export type BillLandedCostTransaction = NonNullable<BillLandedCostTransactionsResponse['data']>[number];

export async function fetchLandedCostTransactions(
  fetcher: ApiFetcher,
  query?: GetLandedCostTransactionsQuery
): Promise<LandedCostTransactionsResponse> {
  const get = fetcher.path(LANDED_COST_ROUTES.TRANSACTIONS).method('get').create();
  const { data } = await (
    get as (params?: GetLandedCostTransactionsQuery) => Promise<{ data: LandedCostTransactionsResponse }>
  )(query ?? {});
  return data;
}

export async function allocateLandedCost(
  fetcher: ApiFetcher,
  billId: number,
  body: AllocateLandedCostBody
): Promise<void> {
  const post = fetcher.path(LANDED_COST_ROUTES.ALLOCATE).method('post').create();
  await post({ billId, ...body } as never);
}

export async function deleteAllocatedLandedCost(
  fetcher: ApiFetcher,
  allocatedLandedCostId: number
): Promise<void> {
  const del = fetcher.path(LANDED_COST_ROUTES.BY_ID).method('delete').create();
  await del({ allocatedLandedCostId });
}

export async function fetchBillLandedCostTransactions(
  fetcher: ApiFetcher,
  billId: number
): Promise<BillLandedCostTransactionsResponse> {
  const get = fetcher.path(LANDED_COST_ROUTES.BILL_TRANSACTIONS).method('get').create();
  const { data } = await get({ billId });
  return data;
}
