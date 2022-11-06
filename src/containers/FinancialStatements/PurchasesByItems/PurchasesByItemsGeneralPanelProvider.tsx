// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { useItems } from '@/hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
const PurchasesByItemsGeneralPanelContext = createContext();

function PurchasesByItemsGeneralPanelProvider({ ...props }) {
  // Handle fetching the items based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
    isFetching: isItemsFetching,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: JSON.stringify([
      { fieldKey: 'type', comparator: 'is', value: 'inventory', index: 1 },
    ]),
  });

  const provider = {
    items,
    isItemsLoading,
    isItemsFetching,
  };

  const loading = isItemsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <PurchasesByItemsGeneralPanelContext.Provider value={provider} {...props} />
  );
}

const usePurchaseByItemsGeneralPanelContext = () =>
  useContext(PurchasesByItemsGeneralPanelContext);

export {
  PurchasesByItemsGeneralPanelProvider,
  usePurchaseByItemsGeneralPanelContext,
};
