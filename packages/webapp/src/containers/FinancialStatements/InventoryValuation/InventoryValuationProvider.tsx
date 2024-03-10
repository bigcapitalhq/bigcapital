// @ts-nocheck
import React from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useInventoryValuationTable } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const InventoryValuationContext = React.createContext();

/**
 * Inventory valuation sheet provider.
 */
function InventoryValuationProvider({ query, ...props }) {
  // Transformes the filter form query to request query.
  const httpQuery = React.useMemo(
    () => transformFilterFormToQuery(query),
    [query],
  );

  const {
    data: inventoryValuation,
    isFetching,
    isLoading,
    refetch,
  } = useInventoryValuationTable(httpQuery, { keepPreviousData: true });

  // Provider data.
  const provider = {
    inventoryValuation,
    isLoading,
    isFetching,
    refetchSheet: refetch,
    httpQuery
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
