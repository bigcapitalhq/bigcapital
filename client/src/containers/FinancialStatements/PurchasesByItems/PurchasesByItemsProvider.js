import React, { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { usePurchasesByItems } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';


const PurchasesByItemsContext = createContext();

function PurchasesByItemsProvider({ query, ...props }) {
  const {
    data: purchaseByItems,
    isFetching,
    isLoading,
    refetch,
  } = usePurchasesByItems(
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
