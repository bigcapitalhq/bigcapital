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

export const VENDOR_BALANCE_ROUTE = '/api/reports/vendor-balance-summary' as const satisfies keyof paths;

type Op = OpForPath<typeof VENDOR_BALANCE_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type VendorBalanceTableQuery = OpQueryParams<Op>;
export type VendorBalanceTableResponse = OpResponseBodyTable<Op>;

export async function fetchVendorBalanceTable(
  fetcher: ApiFetcher,
  query: VendorBalanceTableQuery
): Promise<VendorBalanceTableResponse> {
  const get = fetcher.path(VENDOR_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as VendorBalanceTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type VendorBalanceJsonQuery = OpQueryParams<Op>;
export type VendorBalanceJsonResponse = OpResponseBody<Op>;

export async function fetchVendorBalanceJson(
  fetcher: ApiFetcher,
  query: VendorBalanceJsonQuery
): Promise<VendorBalanceJsonResponse> {
  const get = fetcher.path(VENDOR_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as VendorBalanceJsonResponse;
}

// CSV format (returns Blob)
export type VendorBalanceCsvQuery = OpQueryParams<Op>;
export type VendorBalanceCsvResponse = Blob;

export async function fetchVendorBalanceCsv(
  fetcher: ApiFetcher,
  query: VendorBalanceCsvQuery
): Promise<VendorBalanceCsvResponse> {
  const get = fetcher.path(VENDOR_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as VendorBalanceCsvResponse;
}

// XLSX format (returns Blob)
export type VendorBalanceXlsxQuery = OpQueryParams<Op>;
export type VendorBalanceXlsxResponse = Blob;

export async function fetchVendorBalanceXlsx(
  fetcher: ApiFetcher,
  query: VendorBalanceXlsxQuery
): Promise<VendorBalanceXlsxResponse> {
  const get = fetcher.path(VENDOR_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as VendorBalanceXlsxResponse;
}

// PDF format (returns Blob)
export type VendorBalancePdfQuery = OpQueryParams<Op>;
export type VendorBalancePdfResponse = Blob;

export async function fetchVendorBalancePdf(
  fetcher: ApiFetcher,
  query: VendorBalancePdfQuery
): Promise<VendorBalancePdfResponse> {
  const get = fetcher.path(VENDOR_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as VendorBalancePdfResponse;
}
