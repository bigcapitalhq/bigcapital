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

export const SALES_TAX_LIABILITY_ROUTE = '/api/reports/sales-tax-liability-summary' as const satisfies keyof paths;

type Op = OpForPath<typeof SALES_TAX_LIABILITY_ROUTE, 'get'>;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type SalesTaxLiabilityTableQuery = OpQueryParams<Op>;
export type SalesTaxLiabilityTableResponse = OpResponseBodyTable<Op>;

export async function fetchSalesTaxLiabilityTable(
  fetcher: ApiFetcher,
  query: SalesTaxLiabilityTableQuery
): Promise<SalesTaxLiabilityTableResponse> {
  const get = fetcher.path(SALES_TAX_LIABILITY_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: 'application/json+table' },
  });
  return data as unknown as SalesTaxLiabilityTableResponse;
}

// JSON format - Note: may only have table format in schema
// Using type assertion for JSON format compatibility
export type SalesTaxLiabilityJsonQuery = OpQueryParams<Op>;
export type SalesTaxLiabilityJsonResponse = OpResponseBody<Op>;

export async function fetchSalesTaxLiabilityJson(
  fetcher: ApiFetcher,
  query: SalesTaxLiabilityJsonQuery
): Promise<SalesTaxLiabilityJsonResponse> {
  const get = fetcher.path(SALES_TAX_LIABILITY_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as SalesTaxLiabilityJsonResponse;
}

// CSV format (returns Blob)
export type SalesTaxLiabilityCsvQuery = OpQueryParams<Op>;
export type SalesTaxLiabilityCsvResponse = Blob;

export async function fetchSalesTaxLiabilityCsv(
  fetcher: ApiFetcher,
  query: SalesTaxLiabilityCsvQuery
): Promise<SalesTaxLiabilityCsvResponse> {
  const get = fetcher.path(SALES_TAX_LIABILITY_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as SalesTaxLiabilityCsvResponse;
}

// XLSX format (returns Blob)
export type SalesTaxLiabilityXlsxQuery = OpQueryParams<Op>;
export type SalesTaxLiabilityXlsxResponse = Blob;

export async function fetchSalesTaxLiabilityXlsx(
  fetcher: ApiFetcher,
  query: SalesTaxLiabilityXlsxQuery
): Promise<SalesTaxLiabilityXlsxResponse> {
  const get = fetcher.path(SALES_TAX_LIABILITY_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as SalesTaxLiabilityXlsxResponse;
}

// PDF format (returns Blob)
export type SalesTaxLiabilityPdfQuery = OpQueryParams<Op>;
export type SalesTaxLiabilityPdfResponse = Blob;

export async function fetchSalesTaxLiabilityPdf(
  fetcher: ApiFetcher,
  query: SalesTaxLiabilityPdfQuery
): Promise<SalesTaxLiabilityPdfResponse> {
  const get = fetcher.path(SALES_TAX_LIABILITY_ROUTE).method('get').create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as SalesTaxLiabilityPdfResponse;
}
