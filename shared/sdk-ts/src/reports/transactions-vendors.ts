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

export const TRANSACTIONS_VENDORS_ROUTE = '/api/reports/transactions-by-vendors' as const satisfies keyof paths;

type Op = OpForPath<typeof TRANSACTIONS_VENDORS_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type TransactionsByVendorsTableQuery = OpQueryParams<Op>;
export type TransactionsByVendorsTableResponse = OpResponseBodyTable<Op>;

export async function fetchTransactionsByVendorsTable(
  fetcher: ApiFetcher,
  query: TransactionsByVendorsTableQuery
): Promise<TransactionsByVendorsTableResponse> {
  const get = fetcher.path(TRANSACTIONS_VENDORS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as TransactionsByVendorsTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type TransactionsByVendorsJsonQuery = OpQueryParams<Op>;
export type TransactionsByVendorsJsonResponse = OpResponseBody<Op>;

export async function fetchTransactionsByVendorsJson(
  fetcher: ApiFetcher,
  query: TransactionsByVendorsJsonQuery
): Promise<TransactionsByVendorsJsonResponse> {
  const get = fetcher.path(TRANSACTIONS_VENDORS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as TransactionsByVendorsJsonResponse;
}

// CSV format (returns Blob)
export type TransactionsByVendorsCsvQuery = OpQueryParams<Op>;
export type TransactionsByVendorsCsvResponse = Blob;

export async function fetchTransactionsByVendorsCsv(
  fetcher: ApiFetcher,
  query: TransactionsByVendorsCsvQuery
): Promise<TransactionsByVendorsCsvResponse> {
  const get = fetcher.path(TRANSACTIONS_VENDORS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as TransactionsByVendorsCsvResponse;
}

// XLSX format (returns Blob)
export type TransactionsByVendorsXlsxQuery = OpQueryParams<Op>;
export type TransactionsByVendorsXlsxResponse = Blob;

export async function fetchTransactionsByVendorsXlsx(
  fetcher: ApiFetcher,
  query: TransactionsByVendorsXlsxQuery
): Promise<TransactionsByVendorsXlsxResponse> {
  const get = fetcher.path(TRANSACTIONS_VENDORS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as TransactionsByVendorsXlsxResponse;
}

// PDF format (returns Blob)
export type TransactionsByVendorsPdfQuery = OpQueryParams<Op>;
export type TransactionsByVendorsPdfResponse = Blob;

export async function fetchTransactionsByVendorsPdf(
  fetcher: ApiFetcher,
  query: TransactionsByVendorsPdfQuery
): Promise<TransactionsByVendorsPdfResponse> {
  const get = fetcher.path(TRANSACTIONS_VENDORS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as TransactionsByVendorsPdfResponse;
}
