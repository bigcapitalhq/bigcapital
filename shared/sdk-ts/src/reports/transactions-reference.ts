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

export const TRANSACTIONS_REFERENCE_ROUTE = '/api/reports/transactions-by-reference' as const satisfies keyof paths;

type Op = OpForPath<typeof TRANSACTIONS_REFERENCE_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type TransactionsByReferenceTableQuery = OpQueryParams<Op>;
export type TransactionsByReferenceTableResponse = OpResponseBodyTable<Op>;

export async function fetchTransactionsByReferenceTable(
  fetcher: ApiFetcher,
  query: TransactionsByReferenceTableQuery
): Promise<TransactionsByReferenceTableResponse> {
  const get = fetcher.path(TRANSACTIONS_REFERENCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as TransactionsByReferenceTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type TransactionsByReferenceJsonQuery = OpQueryParams<Op>;
export type TransactionsByReferenceJsonResponse = OpResponseBody<Op>;

export async function fetchTransactionsByReferenceJson(
  fetcher: ApiFetcher,
  query: TransactionsByReferenceJsonQuery
): Promise<TransactionsByReferenceJsonResponse> {
  const get = fetcher.path(TRANSACTIONS_REFERENCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as TransactionsByReferenceJsonResponse;
}

// CSV format (returns Blob)
export type TransactionsByReferenceCsvQuery = OpQueryParams<Op>;
export type TransactionsByReferenceCsvResponse = Blob;

export async function fetchTransactionsByReferenceCsv(
  fetcher: ApiFetcher,
  query: TransactionsByReferenceCsvQuery
): Promise<TransactionsByReferenceCsvResponse> {
  const get = fetcher.path(TRANSACTIONS_REFERENCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as TransactionsByReferenceCsvResponse;
}

// XLSX format (returns Blob)
export type TransactionsByReferenceXlsxQuery = OpQueryParams<Op>;
export type TransactionsByReferenceXlsxResponse = Blob;

export async function fetchTransactionsByReferenceXlsx(
  fetcher: ApiFetcher,
  query: TransactionsByReferenceXlsxQuery
): Promise<TransactionsByReferenceXlsxResponse> {
  const get = fetcher.path(TRANSACTIONS_REFERENCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as TransactionsByReferenceXlsxResponse;
}

// PDF format (returns Blob)
export type TransactionsByReferencePdfQuery = OpQueryParams<Op>;
export type TransactionsByReferencePdfResponse = Blob;

export async function fetchTransactionsByReferencePdf(
  fetcher: ApiFetcher,
  query: TransactionsByReferencePdfQuery
): Promise<TransactionsByReferencePdfResponse> {
  const get = fetcher.path(TRANSACTIONS_REFERENCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as TransactionsByReferencePdfResponse;
}
