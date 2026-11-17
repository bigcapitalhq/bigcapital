import { InventorySummaryTableQuery } from '@bigcapital/sdk-ts';
import { createContext, useContext, useMemo } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useInventorySummaryTable } from '@/hooks/query';

type UseInventorySummaryTableResult = ReturnType<
  typeof useInventorySummaryTable
>;

type InventorySummaryContextValue = {
  inventorySummary: UseInventorySummaryTableResult['data'];
  isFetching: boolean;
  isLoading: boolean;
  refetchSheet: UseInventorySummaryTableResult['refetch'];
  httpQuery: InventorySummaryTableQuery;
};

interface InventorySummaryProviderProps {
  query: Record<string, unknown>;
  children?: React.ReactNode;
}

const InventorySummaryContext = createContext<
  InventorySummaryContextValue | undefined
>(undefined);

function InventorySummaryProvider({
  query,
  ...props
}: InventorySummaryProviderProps) {
  // Transforms the sheet query to http query.
  const httpQuery = useMemo(
    () => transformFilterFormToQuery(query) as InventorySummaryTableQuery,
    [query],
  );

  const {
    data: inventorySummary,
    isFetching,
    isLoading,
    refetch,
  } = useInventorySummaryTable(
    { ...httpQuery },
    { placeholderData: (prev) => prev },
  );

  const provider: InventorySummaryContextValue = {
    inventorySummary,
    isFetching,
    isLoading,
    refetchSheet: refetch,
    httpQuery,
  };
  return (
    <FinancialReportPage name={'inventory-summary'}>
      <InventorySummaryContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useInventorySummaryContext = (): InventorySummaryContextValue => {
  const ctx = useContext(InventorySummaryContext);
  if (!ctx) throw new Error('InventorySummaryContext is not provided');
  return ctx;
};

export { InventorySummaryProvider, useInventorySummaryContext };
