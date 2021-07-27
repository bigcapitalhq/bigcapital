import React from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useItems, useInventoryItemDetailsReport } from 'hooks/query';
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

  // Fetching inventory item details report based on the givne query.
  const {
    data: inventoryItemDetails,
    isFetching: isInventoryItemDetailsFetching,
    isLoading: isInventoryItemDetailsLoading,
    refetch: inventoryItemDetailsRefetch,
  } = useInventoryItemDetailsReport(query, { keepPreviousData: true });

  // Handle fetching the items based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
    isFetching: isItemsFetching,
  } = useItems({ page_size: 10000 });

  const provider = {
    inventoryItemDetails,
    isInventoryItemDetailsFetching,
    isInventoryItemDetailsLoading,
    inventoryItemDetailsRefetch,

    isItemsFetching,
    isItemsLoading,
    items,

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
