// @ts-nocheck
import React from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { useItems } from '@/hooks/query';

const InventoryValuationGeneralPanelContext = React.createContext();

function InventoryValuationGeneralPanelProvider({ query, ...props }) {
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

  // Provider data.
  const provider = {
    items,
    isItemsFetching,
    isItemsLoading,
  };

  const loading = isItemsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <InventoryValuationGeneralPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useInventoryValuationGeneralPanelContext = () =>
  React.useContext(InventoryValuationGeneralPanelContext);

export {
  InventoryValuationGeneralPanelProvider,
  useInventoryValuationGeneralPanelContext,
};
