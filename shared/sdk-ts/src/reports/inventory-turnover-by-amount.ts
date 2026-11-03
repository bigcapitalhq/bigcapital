import type { OpArgType } from 'openapi-typescript-fetch';
import type { ApiFetcher } from '../fetch-utils';
import { withNestedQuery } from '../fetch-utils';
import type { paths } from '../schema';
import {
  OpForPath,
  OpQueryParams,
  OpResponseBody,
  OpResponseBodyTable,
} from '../utils';

export const INVENTORY_TURNOVER_BY_AMOUNT_ROUTE =
  '/api/reports/inventory-turnover-by-amount' as const satisfies keyof paths;

type Op = OpForPath<typeof INVENTORY_TURNOVER_BY_AMOUNT_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

export type InventoryTurnoverByAmountTableQuery = OpQueryParams<Op>;
export type InventoryTurnoverByAmountTableResponse = OpResponseBodyTable<Op>;

export async function fetchInventoryTurnoverByAmountTable(
  fetcher: ApiFetcher,
  query: InventoryTurnoverByAmountTableQuery,
): Promise<InventoryTurnoverByAmountTableResponse> {
  const get = fetcher
    .path(INVENTORY_TURNOVER_BY_AMOUNT_ROUTE)
    .method('get')
    .create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as InventoryTurnoverByAmountTableResponse;
}

export type InventoryTurnoverByAmountJsonQuery = OpQueryParams<Op>;
export type InventoryTurnoverByAmountJsonResponse = OpResponseBody<Op>;

export async function fetchInventoryTurnoverByAmountJson(
  fetcher: ApiFetcher,
  query: InventoryTurnoverByAmountJsonQuery,
): Promise<InventoryTurnoverByAmountJsonResponse> {
  const get = fetcher
    .path(INVENTORY_TURNOVER_BY_AMOUNT_ROUTE)
    .method('get')
    .create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as InventoryTurnoverByAmountJsonResponse;
}

export type InventoryTurnoverByAmountCsvQuery = OpQueryParams<Op>;
export type InventoryTurnoverByAmountCsvResponse = Blob;

export async function fetchInventoryTurnoverByAmountCsv(
  fetcher: ApiFetcher,
  query: InventoryTurnoverByAmountCsvQuery,
): Promise<InventoryTurnoverByAmountCsvResponse> {
  const get = fetcher
    .path(INVENTORY_TURNOVER_BY_AMOUNT_ROUTE)
    .method('get')
    .create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/csv' },
  });
  return response.data as unknown as InventoryTurnoverByAmountCsvResponse;
}

export type InventoryTurnoverByAmountXlsxQuery = OpQueryParams<Op>;
export type InventoryTurnoverByAmountXlsxResponse = Blob;

export async function fetchInventoryTurnoverByAmountXlsx(
  fetcher: ApiFetcher,
  query: InventoryTurnoverByAmountXlsxQuery,
): Promise<InventoryTurnoverByAmountXlsxResponse> {
  const get = fetcher
    .path(INVENTORY_TURNOVER_BY_AMOUNT_ROUTE)
    .method('get')
    .create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/xlsx' },
  });
  return response.data as unknown as InventoryTurnoverByAmountXlsxResponse;
}

export type InventoryTurnoverByAmountPdfQuery = OpQueryParams<Op>;
export type InventoryTurnoverByAmountPdfResponse = Blob;

export async function fetchInventoryTurnoverByAmountPdf(
  fetcher: ApiFetcher,
  query: InventoryTurnoverByAmountPdfQuery,
): Promise<InventoryTurnoverByAmountPdfResponse> {
  const get = fetcher
    .path(INVENTORY_TURNOVER_BY_AMOUNT_ROUTE)
    .method('get')
    .create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/pdf' },
  });
  return response.data as unknown as InventoryTurnoverByAmountPdfResponse;
}
