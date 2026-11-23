import { useCallback, useMemo } from 'react';

/**
 * Report table sorting state row.
 */
export interface ReportSortBy {
  id: string;
  desc: boolean;
}

/**
 * Page query slice that holds the report sorting state.
 */
export interface ReportSortingPageQuery {
  columnSortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UseFinancialReportSortingParams<
  T extends ReportSortingPageQuery,
> {
  pageQuery?: T;
  setPageQuery: (values: Record<string, unknown>) => void;
}

/**
 * Financial report columns sorting.
 *
 * The financial reports are sorted on the backend, so the data table works in
 * the manual sorting mode and reflects the sorting state into the page query
 * instead of sorting the loaded rows on the client.
 * @param {UseFinancialReportSortingParams} params
 * @returns {object}
 */
export const useFinancialReportSorting = <T extends ReportSortingPageQuery>({
  pageQuery,
  setPageQuery,
}: UseFinancialReportSortingParams<T>) => {
  // The initial sorting state is derived from the page query to keep the
  // table header in sync with the backend sorting after a page reload.
  const initialSortBy = useMemo<ReportSortBy[]>(() => {
    return pageQuery?.columnSortBy
      ? [
          {
            id: pageQuery.columnSortBy,
            desc: pageQuery.sortOrder === 'desc',
          },
        ]
      : [];
  }, [pageQuery?.columnSortBy, pageQuery?.sortOrder]);

  // Stores the sorting state in the page query to let the backend sort the
  // report data instead of sorting the loaded rows on the client.
  const handleFetchData = useCallback(
    ({ sortBy }: { sortBy: ReportSortBy[] }) => {
      const [sortedColumn] = sortBy;

      setPageQuery({
        columnSortBy: sortedColumn?.id,
        sortOrder: sortedColumn
          ? sortedColumn.desc
            ? 'desc'
            : 'asc'
          : undefined,
      });
    },
    [setPageQuery],
  );

  return {
    initialSortBy,
    handleFetchData,
    // Props that turn the data table into a backend-sorted table.
    sortableTableProps: {
      manualSortBy: true,
      autoResetSortBy: false,
      initialSortBy,
      onFetchData: handleFetchData,
    },
  };
};
