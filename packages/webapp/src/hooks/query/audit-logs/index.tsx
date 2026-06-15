import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { fetchAuditLogs, fetchAuditLogFilterOptions } from '@bigcapital/sdk-ts';
import { AUDIT_LOGS, AUDIT_LOG_FILTER_OPTIONS } from './query-keys';

export { AuditLogsQueryKeys } from './query-keys';

function auditLogStringListParam(value: string | string[] | null | undefined) {
  if (value == null || value === '') return undefined;
  if (Array.isArray(value)) return value.length ? value : undefined;
  return [value];
}

function buildAuditLogsQuery(page: number, filters: Record<string, any>) {
  return {
    page,
    pageSize: filters.pageSize ?? 20,
    subject: auditLogStringListParam(filters.subject) as any,
    action: auditLogStringListParam(filters.action) as any,
    userId: filters.userId || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
  };
}

export function useAuditLogsQuery(
  filters: Record<string, any>,
  props?: Record<string, any>,
) {
  const fetcher = useApiFetcher();

  return useQuery({
    queryKey: [AUDIT_LOGS, filters],
    queryFn: () =>
      fetchAuditLogs(fetcher, buildAuditLogsQuery(filters.page ?? 1, filters)),
    ...props,
  });
}

export function useAuditLogFilterOptionsQuery(props?: Record<string, any>) {
  const fetcher = useApiFetcher();

  return useQuery({
    queryKey: [AUDIT_LOG_FILTER_OPTIONS],
    queryFn: () =>
      fetchAuditLogFilterOptions(fetcher).then((data) => ({
        subjects: data?.subjects ?? [],
        actions: data?.actions ?? [],
      })),
    staleTime: 5 * 60 * 1000,
    ...props,
  });
}

export function useAuditLogsInfinityQuery(
  filters: Record<string, any>,
  infinityProps?: Record<string, any>,
) {
  const fetcher = useApiFetcher();

  return useInfiniteQuery({
    queryKey: [AUDIT_LOGS, filters],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      fetchAuditLogs(fetcher, buildAuditLogsQuery(pageParam, filters)),
    getNextPageParam: (lastPage: any) => {
      const { pagination } = lastPage;
      return pagination.total > pagination.page_size * pagination.page
        ? pagination.page + 1
        : undefined;
    },
    ...infinityProps,
  });
}
