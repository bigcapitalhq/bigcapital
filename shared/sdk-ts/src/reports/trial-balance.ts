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

export const TRIAL_BALANCE_ROUTE = '/api/reports/trial-balance-sheet' as const satisfies keyof paths;

type Op = OpForPath<typeof TRIAL_BALANCE_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type TrialBalanceTableQuery = OpQueryParams<Op>;
export type TrialBalanceTableResponse = OpResponseBodyTable<Op>;

export async function fetchTrialBalanceTable(
  fetcher: ApiFetcher,
  query: TrialBalanceTableQuery
): Promise<TrialBalanceTableResponse> {
  const get = fetcher.path(TRIAL_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as TrialBalanceTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type TrialBalanceJsonQuery = OpQueryParams<Op>;
export type TrialBalanceJsonResponse = OpResponseBody<Op>;

export async function fetchTrialBalanceJson(
  fetcher: ApiFetcher,
  query: TrialBalanceJsonQuery
): Promise<TrialBalanceJsonResponse> {
  const get = fetcher.path(TRIAL_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as TrialBalanceJsonResponse;
}

// CSV format (returns Blob)
export type TrialBalanceCsvQuery = OpQueryParams<Op>;
export type TrialBalanceCsvResponse = Blob;

export async function fetchTrialBalanceCsv(
  fetcher: ApiFetcher,
  query: TrialBalanceCsvQuery
): Promise<TrialBalanceCsvResponse> {
  const get = fetcher.path(TRIAL_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as TrialBalanceCsvResponse;
}

// XLSX format (returns Blob)
export type TrialBalanceXlsxQuery = OpQueryParams<Op>;
export type TrialBalanceXlsxResponse = Blob;

export async function fetchTrialBalanceXlsx(
  fetcher: ApiFetcher,
  query: TrialBalanceXlsxQuery
): Promise<TrialBalanceXlsxResponse> {
  const get = fetcher.path(TRIAL_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as TrialBalanceXlsxResponse;
}

// PDF format (returns Blob)
export type TrialBalancePdfQuery = OpQueryParams<Op>;
export type TrialBalancePdfResponse = Blob;

export async function fetchTrialBalancePdf(
  fetcher: ApiFetcher,
  query: TrialBalancePdfQuery
): Promise<TrialBalancePdfResponse> {
  const get = fetcher.path(TRIAL_BALANCE_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as TrialBalancePdfResponse;
}
