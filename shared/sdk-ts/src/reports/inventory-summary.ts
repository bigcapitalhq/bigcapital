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

export const INVENTORY_SUMMARY_ROUTE = '/api/reports/inventory-summary' as const satisfies keyof paths;

type Op = OpForPath<typeof INVENTORY_SUMMARY_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type InventorySummaryTableQuery = OpQueryParams<Op>;
export type InventorySummaryTableResponse = OpResponseBodyTable<Op>;

export async function fetchInventorySummaryTable(
  fetcher: ApiFetcher,
  query: InventorySummaryTableQuery
): Promise<InventorySummaryTableResponse> {
  const get = fetcher.path(INVENTORY_SUMMARY_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as InventorySummaryTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type InventorySummaryJsonQuery = OpQueryParams<Op>;
export type InventorySummaryJsonResponse = OpResponseBody<Op>;

export async function fetchInventorySummaryJson(
  fetcher: ApiFetcher,
  query: InventorySummaryJsonQuery
): Promise<InventorySummaryJsonResponse> {
  const get = fetcher.path(INVENTORY_SUMMARY_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as InventorySummaryJsonResponse;
}

// CSV format (returns Blob)
export type InventorySummaryCsvQuery = OpQueryParams<Op>;
export type InventorySummaryCsvResponse = Blob;

export async function fetchInventorySummaryCsv(
  fetcher: ApiFetcher,
  query: InventorySummaryCsvQuery
): Promise<InventorySummaryCsvResponse> {
  const get = fetcher.path(INVENTORY_SUMMARY_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as InventorySummaryCsvResponse;
}

// XLSX format (returns Blob)
export type InventorySummaryXlsxQuery = OpQueryParams<Op>;
export type InventorySummaryXlsxResponse = Blob;

export async function fetchInventorySummaryXlsx(
  fetcher: ApiFetcher,
  query: InventorySummaryXlsxQuery
): Promise<InventorySummaryXlsxResponse> {
  const get = fetcher.path(INVENTORY_SUMMARY_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as InventorySummaryXlsxResponse;
}

// PDF format (returns Blob)
export type InventorySummaryPdfQuery = OpQueryParams<Op>;
export type InventorySummaryPdfResponse = Blob;

export async function fetchInventorySummaryPdf(
  fetcher: ApiFetcher,
  query: InventorySummaryPdfQuery
): Promise<InventorySummaryPdfResponse> {
  const get = fetcher.path(INVENTORY_SUMMARY_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as InventorySummaryPdfResponse;
}
