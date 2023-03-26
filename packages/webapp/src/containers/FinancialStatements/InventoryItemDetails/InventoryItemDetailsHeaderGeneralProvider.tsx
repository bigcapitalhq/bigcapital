// @ts-nocheck
import React from 'react';
import { useItems } from '@/hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const InventoryItemDetailsHeaderGeneralContext = React.createContext();

/**
 * Inventory item details provider.
 */
function InventoryItemDetailsHeaderGeneralProvider({ ...props }) {
  // Handle fetching the items based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
    isFetching: isItemsFetching,
  } = useItems({
    stringified_filter_roles: JSON.stringify([
      { fieldKey: 'type', comparator: 'is', value: 'inventory', index: 1 },
    ]),
    page_size: 10000,
  });

  const provider = {
    isItemsFetching,
    isItemsLoading,
    items,
  };
  // Loading state.
  const loading = isItemsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <InventoryItemDetailsHeaderGeneralContext.Provider
      value={provider}
      {...props}
    />
  );
}
const useInventoryItemDetailsHeaderGeneralContext = () =>
  React.useContext(InventoryItemDetailsHeaderGeneralContext);

export {
  InventoryItemDetailsHeaderGeneralProvider,
  useInventoryItemDetailsHeaderGeneralContext,
};
