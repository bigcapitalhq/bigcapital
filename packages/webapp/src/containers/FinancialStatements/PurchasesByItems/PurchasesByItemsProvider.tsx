// @ts-nocheck
import React, { createContext, useContext, useMemo } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { usePurchasesByItemsTable } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const PurchasesByItemsContext = createContext();

function PurchasesByItemsProvider({ query, ...props }) {
  // Transformes the report query to http query.
  const httpQuery = useMemo(() => transformFilterFormToQuery(query), [query]);

  // Handle fetching the purchases by items report based on the given query.
  const {
    data: purchaseByItems,
    isFetching,
    isLoading,
    refetch,
  } = usePurchasesByItemsTable(httpQuery, { keepPreviousData: true });

  const provider = {
    purchaseByItems,
    isFetching,
    isLoading,
    refetchSheet: refetch,
    httpQuery,
  };
  return (
    <FinancialReportPage name={'purchase-by-items'}>
      <PurchasesByItemsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const usePurchaseByItemsContext = () => useContext(PurchasesByItemsContext);

export { PurchasesByItemsProvider, usePurchaseByItemsContext };
