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

export const TRANSACTIONS_CUSTOMERS_ROUTE = '/api/reports/transactions-by-customers' as const satisfies keyof paths;

type Op = OpForPath<typeof TRANSACTIONS_CUSTOMERS_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type TransactionsByCustomersTableQuery = OpQueryParams<Op>;
export type TransactionsByCustomersTableResponse = OpResponseBodyTable<Op>;

export async function fetchTransactionsByCustomersTable(
  fetcher: ApiFetcher,
  query: TransactionsByCustomersTableQuery
): Promise<TransactionsByCustomersTableResponse> {
  const get = fetcher.path(TRANSACTIONS_CUSTOMERS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as TransactionsByCustomersTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type TransactionsByCustomersJsonQuery = OpQueryParams<Op>;
export type TransactionsByCustomersJsonResponse = OpResponseBody<Op>;

export async function fetchTransactionsByCustomersJson(
  fetcher: ApiFetcher,
  query: TransactionsByCustomersJsonQuery
): Promise<TransactionsByCustomersJsonResponse> {
  const get = fetcher.path(TRANSACTIONS_CUSTOMERS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as TransactionsByCustomersJsonResponse;
}

// CSV format (returns Blob)
export type TransactionsByCustomersCsvQuery = OpQueryParams<Op>;
export type TransactionsByCustomersCsvResponse = Blob;

export async function fetchTransactionsByCustomersCsv(
  fetcher: ApiFetcher,
  query: TransactionsByCustomersCsvQuery
): Promise<TransactionsByCustomersCsvResponse> {
  const get = fetcher.path(TRANSACTIONS_CUSTOMERS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as TransactionsByCustomersCsvResponse;
}

// XLSX format (returns Blob)
export type TransactionsByCustomersXlsxQuery = OpQueryParams<Op>;
export type TransactionsByCustomersXlsxResponse = Blob;

export async function fetchTransactionsByCustomersXlsx(
  fetcher: ApiFetcher,
  query: TransactionsByCustomersXlsxQuery
): Promise<TransactionsByCustomersXlsxResponse> {
  const get = fetcher.path(TRANSACTIONS_CUSTOMERS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as TransactionsByCustomersXlsxResponse;
}

// PDF format (returns Blob)
export type TransactionsByCustomersPdfQuery = OpQueryParams<Op>;
export type TransactionsByCustomersPdfResponse = Blob;

export async function fetchTransactionsByCustomersPdf(
  fetcher: ApiFetcher,
  query: TransactionsByCustomersPdfQuery
): Promise<TransactionsByCustomersPdfResponse> {
  const get = fetcher.path(TRANSACTIONS_CUSTOMERS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as TransactionsByCustomersPdfResponse;
}
