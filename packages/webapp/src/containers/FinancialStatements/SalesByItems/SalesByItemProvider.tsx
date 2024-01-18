// @ts-nocheck
import { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useSalesByItemsTable } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const SalesByItemsContext = createContext();

function SalesByItemProvider({ query, ...props }) {
  const {
    data: salesByItems,
    isFetching,
    isLoading,
    refetch,
  } = useSalesByItemsTable(
    {
      ...transformFilterFormToQuery(query),
    },
    {
      keepPreviousData: true,
    },
  );

  const provider = {
    salesByItems,
    isFetching,
    isLoading,
    refetchSheet: refetch,
  };
  return (
    <FinancialReportPage name={'sales-by-items'}>
      <SalesByItemsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useSalesByItemsContext = () => useContext(SalesByItemsContext);

export { SalesByItemProvider, useSalesByItemsContext };
