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

export const GENERAL_LEDGER_ROUTE = '/api/reports/general-ledger' as const satisfies keyof paths;

type Op = OpForPath<typeof GENERAL_LEDGER_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type GeneralLedgerTableQuery = OpQueryParams<Op>;
export type GeneralLedgerTableResponse = OpResponseBodyTable<Op>;

export async function fetchGeneralLedgerTable(
  fetcher: ApiFetcher,
  query: GeneralLedgerTableQuery
): Promise<GeneralLedgerTableResponse> {
  const get = fetcher.path(GENERAL_LEDGER_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as GeneralLedgerTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type GeneralLedgerJsonQuery = OpQueryParams<Op>;
export type GeneralLedgerJsonResponse = OpResponseBody<Op>;

export async function fetchGeneralLedgerJson(
  fetcher: ApiFetcher,
  query: GeneralLedgerJsonQuery
): Promise<GeneralLedgerJsonResponse> {
  const get = fetcher.path(GENERAL_LEDGER_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as GeneralLedgerJsonResponse;
}

// CSV format (returns Blob)
export type GeneralLedgerCsvQuery = OpQueryParams<Op>;
export type GeneralLedgerCsvResponse = Blob;

export async function fetchGeneralLedgerCsv(
  fetcher: ApiFetcher,
  query: GeneralLedgerCsvQuery
): Promise<GeneralLedgerCsvResponse> {
  const get = fetcher.path(GENERAL_LEDGER_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as GeneralLedgerCsvResponse;
}

// XLSX format (returns Blob)
export type GeneralLedgerXlsxQuery = OpQueryParams<Op>;
export type GeneralLedgerXlsxResponse = Blob;

export async function fetchGeneralLedgerXlsx(
  fetcher: ApiFetcher,
  query: GeneralLedgerXlsxQuery
): Promise<GeneralLedgerXlsxResponse> {
  const get = fetcher.path(GENERAL_LEDGER_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as GeneralLedgerXlsxResponse;
}

// PDF format (returns Blob)
export type GeneralLedgerPdfQuery = OpQueryParams<Op>;
export type GeneralLedgerPdfResponse = Blob;

export async function fetchGeneralLedgerPdf(
  fetcher: ApiFetcher,
  query: GeneralLedgerPdfQuery
): Promise<GeneralLedgerPdfResponse> {
  const get = fetcher.path(GENERAL_LEDGER_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as GeneralLedgerPdfResponse;
}
