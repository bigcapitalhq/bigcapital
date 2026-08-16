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

export const CUSTOMER_BALANCE_ROUTE = '/api/reports/customer-balance-summary' as const satisfies keyof paths;

type Op = OpForPath<typeof CUSTOMER_BALANCE_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type CustomerBalanceTableQuery = OpQueryParams<Op>;
export type CustomerBalanceTableResponse = OpResponseBodyTable<Op>;

export async function fetchCustomerBalanceTable(
  fetcher: ApiFetcher,
  query: CustomerBalanceTableQuery
): Promise<CustomerBalanceTableResponse> {
  const get = fetcher.path(CUSTOMER_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as CustomerBalanceTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type CustomerBalanceJsonQuery = OpQueryParams<Op>;
export type CustomerBalanceJsonResponse = OpResponseBody<Op>;

export async function fetchCustomerBalanceJson(
  fetcher: ApiFetcher,
  query: CustomerBalanceJsonQuery
): Promise<CustomerBalanceJsonResponse> {
  const get = fetcher.path(CUSTOMER_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as CustomerBalanceJsonResponse;
}

// CSV format (returns Blob)
export type CustomerBalanceCsvQuery = OpQueryParams<Op>;
export type CustomerBalanceCsvResponse = Blob;

export async function fetchCustomerBalanceCsv(
  fetcher: ApiFetcher,
  query: CustomerBalanceCsvQuery
): Promise<CustomerBalanceCsvResponse> {
  const get = fetcher.path(CUSTOMER_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as CustomerBalanceCsvResponse;
}

// XLSX format (returns Blob)
export type CustomerBalanceXlsxQuery = OpQueryParams<Op>;
export type CustomerBalanceXlsxResponse = Blob;

export async function fetchCustomerBalanceXlsx(
  fetcher: ApiFetcher,
  query: CustomerBalanceXlsxQuery
): Promise<CustomerBalanceXlsxResponse> {
  const get = fetcher.path(CUSTOMER_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as CustomerBalanceXlsxResponse;
}

// PDF format (returns Blob)
export type CustomerBalancePdfQuery = OpQueryParams<Op>;
export type CustomerBalancePdfResponse = Blob;

export async function fetchCustomerBalancePdf(
  fetcher: ApiFetcher,
  query: CustomerBalancePdfQuery
): Promise<CustomerBalancePdfResponse> {
  const get = fetcher.path(CUSTOMER_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as CustomerBalancePdfResponse;
}
