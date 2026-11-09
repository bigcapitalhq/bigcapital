import type { OpArgType } from 'openapi-typescript-fetch';
import type { ApiFetcher } from '../fetch-utils';
import { withNestedQuery } from "../fetch-utils";
import type { paths } from '../schema';
import {
  OpForPath,
  OpQueryParams,
  OpResponseBody,
  OpResponseBodyTable,
} from '../utils';

export const PURCHASES_BY_ITEMS_ROUTE = '/api/reports/purchases-by-items' as const satisfies keyof paths;

type Op = OpForPath<typeof PURCHASES_BY_ITEMS_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type PurchasesByItemsTableQuery = OpQueryParams<Op>;
export type PurchasesByItemsTableResponse = OpResponseBodyTable<Op>;

export async function fetchPurchasesByItemsTable(
  fetcher: ApiFetcher,
  query: PurchasesByItemsTableQuery
): Promise<PurchasesByItemsTableResponse> {
  const get = fetcher.path(PURCHASES_BY_ITEMS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as PurchasesByItemsTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type PurchasesByItemsJsonQuery = OpQueryParams<Op>;
export type PurchasesByItemsJsonResponse = OpResponseBody<Op>;

export async function fetchPurchasesByItemsJson(
  fetcher: ApiFetcher,
  query: PurchasesByItemsJsonQuery
): Promise<PurchasesByItemsJsonResponse> {
  const get = fetcher.path(PURCHASES_BY_ITEMS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as PurchasesByItemsJsonResponse;
}

// CSV format (returns Blob)
export type PurchasesByItemsCsvQuery = OpQueryParams<Op>;
export type PurchasesByItemsCsvResponse = Blob;

export async function fetchPurchasesByItemsCsv(
  fetcher: ApiFetcher,
  query: PurchasesByItemsCsvQuery
): Promise<PurchasesByItemsCsvResponse> {
  const get = fetcher.path(PURCHASES_BY_ITEMS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as PurchasesByItemsCsvResponse;
}

// XLSX format (returns Blob)
export type PurchasesByItemsXlsxQuery = OpQueryParams<Op>;
export type PurchasesByItemsXlsxResponse = Blob;

export async function fetchPurchasesByItemsXlsx(
  fetcher: ApiFetcher,
  query: PurchasesByItemsXlsxQuery
): Promise<PurchasesByItemsXlsxResponse> {
  const get = fetcher.path(PURCHASES_BY_ITEMS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as PurchasesByItemsXlsxResponse;
}

// PDF format (returns Blob)
export type PurchasesByItemsPdfQuery = OpQueryParams<Op>;
export type PurchasesByItemsPdfResponse = Blob;

export async function fetchPurchasesByItemsPdf(
  fetcher: ApiFetcher,
  query: PurchasesByItemsPdfQuery
): Promise<PurchasesByItemsPdfResponse> {
  const get = fetcher.path(PURCHASES_BY_ITEMS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as PurchasesByItemsPdfResponse;
}
