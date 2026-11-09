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

export const CASHFLOW_ROUTE = '/api/reports/cashflow-statement' as const satisfies keyof paths;

type Op = OpForPath<typeof CASHFLOW_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type CashflowStatementTableQuery = OpQueryParams<Op>;
export type CashflowStatementTableResponse = OpResponseBodyTable<Op>;

export async function fetchCashflowStatementTable(
  fetcher: ApiFetcher,
  query: CashflowStatementTableQuery
): Promise<CashflowStatementTableResponse> {
  const get = fetcher.path(CASHFLOW_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as CashflowStatementTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type CashflowStatementJsonQuery = OpQueryParams<Op>;
export type CashflowStatementJsonResponse = OpResponseBody<Op>;

export async function fetchCashflowStatementJson(
  fetcher: ApiFetcher,
  query: CashflowStatementJsonQuery
): Promise<CashflowStatementJsonResponse> {
  const get = fetcher.path(CASHFLOW_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as CashflowStatementJsonResponse;
}

// CSV format (returns Blob)
export type CashflowStatementCsvQuery = OpQueryParams<Op>;
export type CashflowStatementCsvResponse = Blob;

export async function fetchCashflowStatementCsv(
  fetcher: ApiFetcher,
  query: CashflowStatementCsvQuery
): Promise<CashflowStatementCsvResponse> {
  const get = fetcher.path(CASHFLOW_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as CashflowStatementCsvResponse;
}

// XLSX format (returns Blob)
export type CashflowStatementXlsxQuery = OpQueryParams<Op>;
export type CashflowStatementXlsxResponse = Blob;

export async function fetchCashflowStatementXlsx(
  fetcher: ApiFetcher,
  query: CashflowStatementXlsxQuery
): Promise<CashflowStatementXlsxResponse> {
  const get = fetcher.path(CASHFLOW_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as CashflowStatementXlsxResponse;
}

// PDF format (returns Blob)
export type CashflowStatementPdfQuery = OpQueryParams<Op>;
export type CashflowStatementPdfResponse = Blob;

export async function fetchCashflowStatementPdf(
  fetcher: ApiFetcher,
  query: CashflowStatementPdfQuery
): Promise<CashflowStatementPdfResponse> {
  const get = fetcher.path(CASHFLOW_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as CashflowStatementPdfResponse;
}
