import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import type { Item } from '@bigcapital/sdk-ts';
import { useItems } from '@/hooks/query';

interface PurchasesByItemsGeneralPanelContextValue {
  items: Item[] | undefined;
  isItemsLoading: boolean;
  isItemsFetching: boolean;
}

interface PurchasesByItemsGeneralPanelProviderProps {
  children?: React.ReactNode;
}

const PurchasesByItemsGeneralPanelContext = createContext<
  PurchasesByItemsGeneralPanelContextValue | undefined
>(undefined);

function PurchasesByItemsGeneralPanelProvider({
  ...props
}: PurchasesByItemsGeneralPanelProviderProps) {
  // Handle fetching the items based on the given query.
  const {
    data: itemsData,
    isLoading: isItemsLoading,
    isFetching: isItemsFetching,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: JSON.stringify([
      { fieldKey: 'type', comparator: 'is', value: 'inventory', index: 1 },
    ]),
  });

  const provider: PurchasesByItemsGeneralPanelContextValue = {
    items: (itemsData as any)?.items,
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

const usePurchaseByItemsGeneralPanelContext =
  (): PurchasesByItemsGeneralPanelContextValue => {
    const ctx = useContext(PurchasesByItemsGeneralPanelContext);
    if (!ctx)
      throw new Error('PurchasesByItemsGeneralPanelContext is not provided');
    return ctx;
  };

export {
  PurchasesByItemsGeneralPanelProvider,
  usePurchaseByItemsGeneralPanelContext,
};
