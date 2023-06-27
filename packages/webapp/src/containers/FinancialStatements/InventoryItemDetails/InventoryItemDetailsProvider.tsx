// @ts-nocheck
import React from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useInventoryItemDetailsReport } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const InventoryItemDetailsContext = React.createContext();

/**
 * Inventory item details provider.
 */
function InventoryItemDetailsProvider({ query, ...props }) {
  const requestQuery = React.useMemo(
    () => transformFilterFormToQuery(query),
    [query],
  );

  // Fetching inventory item details report based on the given query.
  const {
    data: inventoryItemDetails,
    isFetching: isInventoryItemDetailsFetching,
    isLoading: isInventoryItemDetailsLoading,
    refetch: inventoryItemDetailsRefetch,
  } = useInventoryItemDetailsReport(requestQuery, { keepPreviousData: true });

  const provider = {
    inventoryItemDetails,
    isInventoryItemDetailsFetching,
    isInventoryItemDetailsLoading,
    inventoryItemDetailsRefetch,

    query,
  };

  return (
    <FinancialReportPage name={'inventory-item-details'}>
      <InventoryItemDetailsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}
const useInventoryItemDetailsContext = () =>
  React.useContext(InventoryItemDetailsContext);

export { InventoryItemDetailsProvider, useInventoryItemDetailsContext };
