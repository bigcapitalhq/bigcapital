import type { ApiFetcher } from "../fetch-utils";
import type { paths } from "../schema";
import type {
  OpForPath,
  OpQueryParams,
  OpResponseBody,
  OpResponseBodyTable,
} from "../utils";

export const RECONCILIATION_STATUS_ROUTE =
  "/api/reports/reconciliation-status" as const satisfies keyof paths;

type Op = OpForPath<typeof RECONCILIATION_STATUS_ROUTE, "get">;

export type ReconciliationStatusReportQuery = OpQueryParams<Op>;
export type ReconciliationStatusReportResponse = OpResponseBody<Op>;
export type ReconciliationStatusTableResponse = OpResponseBodyTable<Op>;

function requestReport(
  fetcher: ApiFetcher,
  query: ReconciliationStatusReportQuery,
  accept: string,
) {
  const get = fetcher.path(RECONCILIATION_STATUS_ROUTE).method("get").create();
  return get(query, { headers: { accept } });
}

export async function fetchReconciliationStatus(
  fetcher: ApiFetcher,
  query: ReconciliationStatusReportQuery,
): Promise<ReconciliationStatusReportResponse> {
  const { data } = await requestReport(fetcher, query, "application/json");
  return data;
}

export async function fetchReconciliationStatusTable(
  fetcher: ApiFetcher,
  query: ReconciliationStatusReportQuery,
): Promise<ReconciliationStatusTableResponse> {
  const { data } = await requestReport(fetcher, query, "application/json+table");
  return data as unknown as ReconciliationStatusTableResponse;
}

export async function fetchReconciliationStatusCsv(
  fetcher: ApiFetcher,
  query: ReconciliationStatusReportQuery,
): Promise<string> {
  const { data } = await requestReport(fetcher, query, "application/csv");
  return data as unknown as string;
}

export async function fetchReconciliationStatusXlsx(
  fetcher: ApiFetcher,
  query: ReconciliationStatusReportQuery,
): Promise<Blob> {
  const { data } = await requestReport(fetcher, query, "application/xlsx");
  return data as unknown as Blob;
}

export async function fetchReconciliationStatusPdf(
  fetcher: ApiFetcher,
  query: ReconciliationStatusReportQuery,
): Promise<Blob> {
  const { data } = await requestReport(fetcher, query, "application/pdf");
  return data as unknown as Blob;
}
