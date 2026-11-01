import React, { createContext, useCallback, useContext, useMemo } from 'react';
import type { AuditLogsResponse } from '@bigcapital/sdk-ts';
import { IntersectionObserver } from '@/components';
import { useAuditLogsInfinityQuery } from '@/hooks/query';
import { useFlattenInfinityPages } from '@/hooks/utils';

interface AuditLogQuery {
  subject?: string | string[];
  action?: string | string[];
  fromDate?: string;
  toDate?: string;
  [key: string]: unknown;
}

interface AuditLogContextValue {
  auditLogs: Record<string, any>[];
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  handleObserverInteract: () => void;
  sheetRefresh: () => void;
  httpQuery: Record<string, unknown>;
}

interface AuditLogProviderProps {
  query: AuditLogQuery;
  children?: React.ReactNode;
}

// Context for Audit Log
const AuditLogContext = createContext<AuditLogContextValue | undefined>(
  undefined,
);

const useAuditLogContext = (): AuditLogContextValue => {
  const ctx = useContext(AuditLogContext);
  if (!ctx) {
    throw new Error(
      'useAuditLogContext must be used within an AuditLogProvider',
    );
  }
  return ctx;
};

/**
 * Audit Log Provider
 */
function toHttpStringList(
  value: string | string[] | null | undefined,
): string[] | undefined {
  if (value == null || value === '') return undefined;
  if (Array.isArray(value)) return value.length ? value : undefined;
  return [value];
}

function AuditLogProvider({ query, children }: AuditLogProviderProps) {
  const httpQuery = useMemo(() => {
    return {
      pageSize: 20,
      subject: toHttpStringList(query.subject as string | string[]),
      action: toHttpStringList(query.action as string | string[]),
      from: query.fromDate || undefined,
      to: query.toDate || undefined,
    };
  }, [query]);

  const {
    data: auditLogsPages,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useAuditLogsInfinityQuery(httpQuery);

  const auditLogs = useFlattenInfinityPages<
    AuditLogsResponse,
    Record<string, any>
  >(auditLogsPages, (page) => page.data);

  const handleObserverInteract = useCallback(() => {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetching, hasNextPage, fetchNextPage]);

  const provider: AuditLogContextValue = {
    auditLogs,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    handleObserverInteract,
    sheetRefresh: refetch as () => void,
    httpQuery,
  };

  return (
    <AuditLogContext.Provider value={provider}>
      {children}
      <IntersectionObserver onIntersect={handleObserverInteract} />
    </AuditLogContext.Provider>
  );
}

export { AuditLogProvider, useAuditLogContext };
