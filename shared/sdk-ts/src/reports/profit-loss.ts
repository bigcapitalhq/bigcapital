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

export const PROFIT_LOSS_ROUTE = '/api/reports/profit-loss-sheet' as const satisfies keyof paths;

type Op = OpForPath<typeof PROFIT_LOSS_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type ProfitLossTableQuery = OpQueryParams<Op>;
export type ProfitLossTableResponse = OpResponseBodyTable<Op>;

export async function fetchProfitLossTable(
  fetcher: ApiFetcher,
  query: ProfitLossTableQuery
): Promise<ProfitLossTableResponse> {
  const get = fetcher.path(PROFIT_LOSS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as ProfitLossTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type ProfitLossJsonQuery = OpQueryParams<Op>;
export type ProfitLossJsonResponse = OpResponseBody<Op>;

export async function fetchProfitLossJson(
  fetcher: ApiFetcher,
  query: ProfitLossJsonQuery
): Promise<ProfitLossJsonResponse> {
  const get = fetcher.path(PROFIT_LOSS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as ProfitLossJsonResponse;
}

// CSV format (returns Blob)
export type ProfitLossCsvQuery = OpQueryParams<Op>;
export type ProfitLossCsvResponse = Blob;

export async function fetchProfitLossCsv(
  fetcher: ApiFetcher,
  query: ProfitLossCsvQuery
): Promise<ProfitLossCsvResponse> {
  const get = fetcher.path(PROFIT_LOSS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as ProfitLossCsvResponse;
}

// XLSX format (returns Blob)
export type ProfitLossXlsxQuery = OpQueryParams<Op>;
export type ProfitLossXlsxResponse = Blob;

export async function fetchProfitLossXlsx(
  fetcher: ApiFetcher,
  query: ProfitLossXlsxQuery
): Promise<ProfitLossXlsxResponse> {
  const get = fetcher.path(PROFIT_LOSS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as ProfitLossXlsxResponse;
}

// PDF format (returns Blob)
export type ProfitLossPdfQuery = OpQueryParams<Op>;
export type ProfitLossPdfResponse = Blob;

export async function fetchProfitLossPdf(
  fetcher: ApiFetcher,
  query: ProfitLossPdfQuery
): Promise<ProfitLossPdfResponse> {
  const get = fetcher.path(PROFIT_LOSS_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as ProfitLossPdfResponse;
}
