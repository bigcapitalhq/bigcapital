import React from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useInventoryItemDetailsReport } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const InventoryItemDetailsContext = React.createContext();

/**
 * Inventory item details provider.
 */
function InventoryItemDetailsProvider({ filter, ...props }) {
  const query = React.useMemo(
    () => transformFilterFormToQuery(filter),
    [filter],
  );

  // fetch inventory item details.
  const {
    data: inventoryItemDetails,
    isFetching: isInventoryItemDetailsFetching,
    isLoading: isInventoryItemDetailsLoading,
    refetch: inventoryItemDetailsRefetch,
  } = useInventoryItemDetailsReport(query, { keepPreviousData: true });

  const provider = {
    inventoryItemDetails,
    isInventoryItemDetailsFetching,
    isInventoryItemDetailsLoading,
    inventoryItemDetailsRefetch,
    query,
    filter,
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
