import { SalesByItemsTableQuery } from '@bigcapital/sdk-ts';
import { createContext, useContext, useMemo } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useSalesByItemsTable } from '@/hooks/query';

type UseSalesByItemsTableResult = ReturnType<typeof useSalesByItemsTable>;

type SalesByItemsContextValue = {
  salesByItems: UseSalesByItemsTableResult['data'];
  isFetching: boolean;
  isLoading: boolean;
  refetchSheet: UseSalesByItemsTableResult['refetch'];
  httpQuery: SalesByItemsTableQuery;
};

interface SalesByItemProviderProps {
  query: Record<string, unknown>;
  children?: React.ReactNode;
}

const SalesByItemsContext = createContext<SalesByItemsContextValue | undefined>(
  undefined,
);

function SalesByItemProvider({ query, ...props }: SalesByItemProviderProps) {
  // Transforms the sheet query to http query.
  const httpQuery = useMemo(
    () => transformFilterFormToQuery(query) as SalesByItemsTableQuery,
    [query],
  );

  const {
    data: salesByItems,
    isFetching,
    isLoading,
    refetch,
  } = useSalesByItemsTable(
    { ...httpQuery },
    { placeholderData: (prev) => prev },
  );

  const provider: SalesByItemsContextValue = {
    salesByItems,
    isFetching,
    isLoading,
    refetchSheet: refetch,
    httpQuery,
  };
  return (
    <FinancialReportPage name={'sales-by-items'}>
      <SalesByItemsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useSalesByItemsContext = (): SalesByItemsContextValue => {
  const ctx = useContext(SalesByItemsContext);
  if (!ctx) throw new Error('SalesByItemsContext is not provided');
  return ctx;
};

export { SalesByItemProvider, useSalesByItemsContext };
