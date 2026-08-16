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

export const PAYABLE_AGING_ROUTE = '/api/reports/payable-aging-summary' as const satisfies keyof paths;

type Op = OpForPath<typeof PAYABLE_AGING_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type PayableAgingTableQuery = OpQueryParams<Op>;
export type PayableAgingTableResponse = OpResponseBodyTable<Op>;

export async function fetchPayableAgingTable(
  fetcher: ApiFetcher,
  query: PayableAgingTableQuery
): Promise<PayableAgingTableResponse> {
  const get = fetcher.path(PAYABLE_AGING_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as PayableAgingTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type PayableAgingJsonQuery = OpQueryParams<Op>;
export type PayableAgingJsonResponse = OpResponseBody<Op>;

export async function fetchPayableAgingJson(
  fetcher: ApiFetcher,
  query: PayableAgingJsonQuery
): Promise<PayableAgingJsonResponse> {
  const get = fetcher.path(PAYABLE_AGING_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as PayableAgingJsonResponse;
}

// CSV format (returns Blob)
export type PayableAgingCsvQuery = OpQueryParams<Op>;
export type PayableAgingCsvResponse = Blob;

export async function fetchPayableAgingCsv(
  fetcher: ApiFetcher,
  query: PayableAgingCsvQuery
): Promise<PayableAgingCsvResponse> {
  const get = fetcher.path(PAYABLE_AGING_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as PayableAgingCsvResponse;
}

// XLSX format (returns Blob)
export type PayableAgingXlsxQuery = OpQueryParams<Op>;
export type PayableAgingXlsxResponse = Blob;

export async function fetchPayableAgingXlsx(
  fetcher: ApiFetcher,
  query: PayableAgingXlsxQuery
): Promise<PayableAgingXlsxResponse> {
  const get = fetcher.path(PAYABLE_AGING_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as PayableAgingXlsxResponse;
}

// PDF format (returns Blob)
export type PayableAgingPdfQuery = OpQueryParams<Op>;
export type PayableAgingPdfResponse = Blob;

export async function fetchPayableAgingPdf(
  fetcher: ApiFetcher,
  query: PayableAgingPdfQuery
): Promise<PayableAgingPdfResponse> {
  const get = fetcher.path(PAYABLE_AGING_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as PayableAgingPdfResponse;
}
