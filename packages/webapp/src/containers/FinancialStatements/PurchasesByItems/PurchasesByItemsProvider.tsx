// @ts-nocheck
import React, { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { usePurchasesByItemsTable } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const PurchasesByItemsContext = createContext();

function PurchasesByItemsProvider({ query, ...props }) {
  // Handle fetching the purchases by items report based on the given query.
  const {
    data: purchaseByItems,
    isFetching,
    isLoading,
    refetch,
  } = usePurchasesByItemsTable(
    {
      ...transformFilterFormToQuery(query),
    },
    {
      keepPreviousData: true,
    },
  );

  const provider = {
    purchaseByItems,
    isFetching,
    isLoading,
    refetchSheet: refetch,
  };
  return (
    <FinancialReportPage name={'purchase-by-items'}>
      <PurchasesByItemsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const usePurchaseByItemsContext = () => useContext(PurchasesByItemsContext);

export { PurchasesByItemsProvider, usePurchaseByItemsContext };
