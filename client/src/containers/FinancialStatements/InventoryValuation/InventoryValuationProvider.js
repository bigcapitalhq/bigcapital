import React from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useInventoryValuation } from 'hooks/query';
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

  const provider = {
    inventoryValuation,
    isLoading,
    isFetching,
    refetchSheet: refetch,
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
