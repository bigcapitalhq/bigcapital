import React, { createContext, useContext, useMemo } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useInventoryItemDetailsReport } from '@/hooks/query';

type UseInventoryItemDetailsReportResult = ReturnType<
  typeof useInventoryItemDetailsReport
>;

type InventoryItemDetailsContextValue = {
  inventoryItemDetails: UseInventoryItemDetailsReportResult['data'];
  isInventoryItemDetailsFetching: boolean;
  isInventoryItemDetailsLoading: boolean;
  inventoryItemDetailsRefetch: UseInventoryItemDetailsReportResult['refetch'];
  httpQuery: Record<string, unknown>;
  query: Record<string, unknown>;
};

type InventoryItemDetailsProviderProps = {
  query: Record<string, unknown>;
  children?: React.ReactNode;
};

const InventoryItemDetailsContext = createContext<
  InventoryItemDetailsContextValue | undefined
>(undefined);

/**
 * Inventory item details provider.
 */
function InventoryItemDetailsProvider({
  query,
  ...props
}: InventoryItemDetailsProviderProps) {
  const requestQuery = useMemo(
    () => transformFilterFormToQuery(query) as Record<string, unknown>,
    [query],
  );

  // Fetching inventory item details report based on the givne query.
  const {
    data: inventoryItemDetails,
    isFetching: isInventoryItemDetailsFetching,
    isLoading: isInventoryItemDetailsLoading,
    refetch: inventoryItemDetailsRefetch,
  } = useInventoryItemDetailsReport(requestQuery, {
    placeholderData: (previousData) => previousData,
  });

  const provider: InventoryItemDetailsContextValue = {
    inventoryItemDetails,
    isInventoryItemDetailsFetching,
    isInventoryItemDetailsLoading,
    inventoryItemDetailsRefetch,
    query,
    httpQuery: requestQuery,
  };

  return (
    <FinancialReportPage name={'inventory-item-details'}>
      <InventoryItemDetailsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useInventoryItemDetailsContext = (): InventoryItemDetailsContextValue => {
  const ctx = useContext(InventoryItemDetailsContext);
  if (!ctx) {
    throw new Error(
      'useInventoryItemDetailsContext must be used within an InventoryItemDetailsProvider',
    );
  }
  return ctx;
};

export { InventoryItemDetailsProvider, useInventoryItemDetailsContext };
