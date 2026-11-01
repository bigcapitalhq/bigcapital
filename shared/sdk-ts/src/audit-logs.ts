import type { ApiFetcher } from './fetch-utils';
import type { paths } from './schema';
import { OpForPath, OpQueryParams, OpResponseBody } from './utils';

export const AUDIT_LOGS_ROUTES = {
  LIST: '/api/audit-logs',
  FILTER_OPTIONS: '/api/audit-logs/filter-options',
} as const satisfies Record<string, keyof paths>;

type ListOp = OpForPath<typeof AUDIT_LOGS_ROUTES.LIST, 'get'>;
type FilterOp = OpForPath<typeof AUDIT_LOGS_ROUTES.FILTER_OPTIONS, 'get'>;

export type AuditLogsQuery = OpQueryParams<ListOp>;
export type AuditLogsResponse = OpResponseBody<ListOp>;
export type AuditLogFilterOptionsResponse = OpResponseBody<FilterOp>;

export async function fetchAuditLogs(
  fetcher: ApiFetcher,
  query?: AuditLogsQuery,
): Promise<AuditLogsResponse> {
  const get = fetcher.path(AUDIT_LOGS_ROUTES.LIST).method('get').create();
  const { data } = await get((query ?? {}) as never);
  return data;
}

export async function fetchAuditLogFilterOptions(
  fetcher: ApiFetcher,
): Promise<AuditLogFilterOptionsResponse> {
  const get = fetcher.path(AUDIT_LOGS_ROUTES.FILTER_OPTIONS).method('get').create();
  const { data } = await get({} as never);
  return data;
}
