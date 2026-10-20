import type { OpArgType } from "openapi-typescript-fetch";
import type { ApiFetcher } from "../fetch-utils";
import { withNestedQuery } from "../fetch-utils";
import type { paths } from "../schema";
import {
  OpForPath,
  OpQueryParams,
  OpResponseBody,
  OpResponseBodyTable,
} from "../utils";

export const BUDGET_VS_ACTUAL_ROUTE =
  "/api/reports/budget-vs-actual" as const satisfies keyof paths;

type Op = OpForPath<typeof BUDGET_VS_ACTUAL_ROUTE, "get">;
type Arg = OpArgType<Op>;

// Table format (existing functionality)
export type BudgetVsActualTableQuery = OpQueryParams<Op>;
export type BudgetVsActualTableResponse = OpResponseBodyTable<Op>;

export async function fetchBudgetVsActualTable(
  fetcher: ApiFetcher,
  query: BudgetVsActualTableQuery,
): Promise<BudgetVsActualTableResponse> {
  const get = fetcher.path(BUDGET_VS_ACTUAL_ROUTE).method("get").create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/json+table" },
  });
  return data as unknown as BudgetVsActualTableResponse;
}

// JSON (sheet) format.
export type BudgetVsActualJsonQuery = OpQueryParams<Op>;
export type BudgetVsActualJsonResponse = OpResponseBody<Op>;

export async function fetchBudgetVsActualJson(
  fetcher: ApiFetcher,
  query: BudgetVsActualJsonQuery,
): Promise<BudgetVsActualJsonResponse> {
  const get = fetcher.path(BUDGET_VS_ACTUAL_ROUTE).method("get").create();
  const { payload, init } = withNestedQuery(query);
  const { data } = await get(payload as Arg, init);
  return data as unknown as BudgetVsActualJsonResponse;
}

// CSV format (returns Blob)
export type BudgetVsActualCsvQuery = OpQueryParams<Op>;
export type BudgetVsActualCsvResponse = Blob;

export async function fetchBudgetVsActualCsv(
  fetcher: ApiFetcher,
  query: BudgetVsActualCsvQuery,
): Promise<BudgetVsActualCsvResponse> {
  const get = fetcher.path(BUDGET_VS_ACTUAL_ROUTE).method("get").create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/csv" },
  });
  return response.data as unknown as BudgetVsActualCsvResponse;
}

// XLSX format (returns Blob)
export type BudgetVsActualXlsxQuery = OpQueryParams<Op>;
export type BudgetVsActualXlsxResponse = Blob;

export async function fetchBudgetVsActualXlsx(
  fetcher: ApiFetcher,
  query: BudgetVsActualXlsxQuery,
): Promise<BudgetVsActualXlsxResponse> {
  const get = fetcher.path(BUDGET_VS_ACTUAL_ROUTE).method("get").create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/xlsx" },
  });
  return response.data as unknown as BudgetVsActualXlsxResponse;
}

// PDF format (returns Blob)
export type BudgetVsActualPdfQuery = OpQueryParams<Op>;
export type BudgetVsActualPdfResponse = Blob;

export async function fetchBudgetVsActualPdf(
  fetcher: ApiFetcher,
  query: BudgetVsActualPdfQuery,
): Promise<BudgetVsActualPdfResponse> {
  const get = fetcher.path(BUDGET_VS_ACTUAL_ROUTE).method("get").create();
  const { payload, init } = withNestedQuery(query);
  const response = await get(payload as Arg, {
    ...init,
    headers: { ...init?.headers, accept: "application/pdf" },
  });
  return response.data as unknown as BudgetVsActualPdfResponse;
}
