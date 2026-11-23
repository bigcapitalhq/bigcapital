import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import type { Item } from '@bigcapital/sdk-ts';
import { useItems } from '@/hooks/query';

interface InventorySummaryGeneralPanelContextValue {
  items: Item[] | undefined;
  isItemsLoading: boolean;
  isItemsFetching: boolean;
}

interface InventorySummaryGeneralPanelProviderProps {
  children?: React.ReactNode;
}

const InventorySummaryGeneralPanelContext = createContext<
  InventorySummaryGeneralPanelContextValue | undefined
>(undefined);

/**
 * Inventory summary - General panel - Booting.
 */
function InventorySummaryGeneralPanelProvider({
  ...props
}: InventorySummaryGeneralPanelProviderProps) {
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

  const provider: InventorySummaryGeneralPanelContextValue = {
    items: (itemsData as any)?.data,
    isItemsLoading,
    isItemsFetching,
  };
  const loading = isItemsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <InventorySummaryGeneralPanelContext.Provider value={provider} {...props} />
  );
}

const useInventorySummaryGeneralPanelContext =
  (): InventorySummaryGeneralPanelContextValue => {
    const ctx = useContext(InventorySummaryGeneralPanelContext);
    if (!ctx)
      throw new Error('InventorySummaryGeneralPanelContext is not provided');
    return ctx;
  };

export {
  InventorySummaryGeneralPanelProvider,
  useInventorySummaryGeneralPanelContext,
};
