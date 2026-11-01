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

export const RECEIVABLE_AGING_ROUTE = '/api/reports/receivable-aging-summary' as const satisfies keyof paths;

type Op = OpForPath<typeof RECEIVABLE_AGING_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type ReceivableAgingTableQuery = OpQueryParams<Op>;
export type ReceivableAgingTableResponse = OpResponseBodyTable<Op>;

export async function fetchReceivableAgingTable(
  fetcher: ApiFetcher,
  query: ReceivableAgingTableQuery
): Promise<ReceivableAgingTableResponse> {
  const get = fetcher.path(RECEIVABLE_AGING_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as ReceivableAgingTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type ReceivableAgingJsonQuery = OpQueryParams<Op>;
export type ReceivableAgingJsonResponse = OpResponseBody<Op>;

export async function fetchReceivableAgingJson(
  fetcher: ApiFetcher,
  query: ReceivableAgingJsonQuery
): Promise<ReceivableAgingJsonResponse> {
  const get = fetcher.path(RECEIVABLE_AGING_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as ReceivableAgingJsonResponse;
}

// CSV format (returns Blob)
export type ReceivableAgingCsvQuery = OpQueryParams<Op>;
export type ReceivableAgingCsvResponse = Blob;

export async function fetchReceivableAgingCsv(
  fetcher: ApiFetcher,
  query: ReceivableAgingCsvQuery
): Promise<ReceivableAgingCsvResponse> {
  const get = fetcher.path(RECEIVABLE_AGING_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as ReceivableAgingCsvResponse;
}

// XLSX format (returns Blob)
export type ReceivableAgingXlsxQuery = OpQueryParams<Op>;
export type ReceivableAgingXlsxResponse = Blob;

export async function fetchReceivableAgingXlsx(
  fetcher: ApiFetcher,
  query: ReceivableAgingXlsxQuery
): Promise<ReceivableAgingXlsxResponse> {
  const get = fetcher.path(RECEIVABLE_AGING_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as ReceivableAgingXlsxResponse;
}

// PDF format (returns Blob)
export type ReceivableAgingPdfQuery = OpQueryParams<Op>;
export type ReceivableAgingPdfResponse = Blob;

export async function fetchReceivableAgingPdf(
  fetcher: ApiFetcher,
  query: ReceivableAgingPdfQuery
): Promise<ReceivableAgingPdfResponse> {
  const get = fetcher.path(RECEIVABLE_AGING_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as ReceivableAgingPdfResponse;
}
