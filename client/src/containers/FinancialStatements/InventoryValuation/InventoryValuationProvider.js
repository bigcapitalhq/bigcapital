import React from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useInventoryValuation, useItems } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const InventoryValuationContext = React.createContext();

function InventoryValuationProvider({ query, ...props }) {
  const {
    data: inventoryValuation,
    isFetching,
    isLoading,
    refetch,
  } = useInventoryValuation(
    {
      ...transformFilterFormToQuery(query),
    },
    {
      keepPreviousData: true,
    },
  );

  // Handle fetching the items based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
    isFetching: isItemsFetching,
  } = useItems({ page_size: 10000 });

  // Provider data.
  const provider = {
    inventoryValuation,
    isLoading,
    isFetching,
    refetchSheet: refetch,

    items,
    isItemsFetching,
    isItemsLoading
  };

  return (
    <FinancialReportPage name={'inventory-valuation'}>
      <InventoryValuationContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useInventoryValuationContext = () =>
  React.useContext(InventoryValuationContext);

export { InventoryValuationProvider, useInventoryValuationContext };
