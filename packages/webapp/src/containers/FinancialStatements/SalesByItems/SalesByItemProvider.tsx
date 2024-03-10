// @ts-nocheck
import { createContext, useContext, useMemo } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useSalesByItemsTable } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const SalesByItemsContext = createContext();

function SalesByItemProvider({ query, ...props }) {
  // Transformes the sheet query to http query.
  const httpQuery = useMemo(() => transformFilterFormToQuery(query), [query]);

  const {
    data: salesByItems,
    isFetching,
    isLoading,
    refetch,
  } = useSalesByItemsTable({ ...httpQuery }, { keepPreviousData: true });

  const provider = {
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

const useSalesByItemsContext = () => useContext(SalesByItemsContext);

export { SalesByItemProvider, useSalesByItemsContext };
