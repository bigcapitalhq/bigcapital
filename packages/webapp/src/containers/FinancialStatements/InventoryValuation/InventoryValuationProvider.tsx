import React, { createContext, useContext, useMemo } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useInventoryValuationTable } from '@/hooks/query';

type UseInventoryValuationTableResult = ReturnType<
  typeof useInventoryValuationTable
>;

type InventoryValuationContextValue = {
  inventoryValuation: UseInventoryValuationTableResult['data'];
  isFetching: boolean;
  isLoading: boolean;
  refetchSheet: UseInventoryValuationTableResult['refetch'];
  httpQuery: Record<string, unknown>;
  query: Record<string, unknown>;
};

type InventoryValuationProviderProps = {
  query: Record<string, unknown>;
  children?: React.ReactNode;
};

const InventoryValuationContext = createContext<
  InventoryValuationContextValue | undefined
>(undefined);

/**
 * Inventory valuation sheet provider.
 */
function InventoryValuationProvider({
  query,
  ...props
}: InventoryValuationProviderProps) {
  // Transformes the filter form query to request query.
  const httpQuery = useMemo(
    () => transformFilterFormToQuery(query) as Record<string, unknown>,
    [query],
  );

  const {
    data: inventoryValuation,
    isFetching,
    isLoading,
    refetch,
  } = useInventoryValuationTable(httpQuery, {
    placeholderData: (previousData) => previousData,
  });

  // Provider data.
  const provider: InventoryValuationContextValue = {
    inventoryValuation,
    isLoading,
    isFetching,
    refetchSheet: refetch,
    httpQuery,
    query,
  };

  return (
    <FinancialReportPage name={'inventory-valuation'}>
      <InventoryValuationContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useInventoryValuationContext = (): InventoryValuationContextValue => {
  const ctx = useContext(InventoryValuationContext);
  if (!ctx) {
    throw new Error(
      'useInventoryValuationContext must be used within an InventoryValuationProvider',
    );
  }
  return ctx;
};

export { InventoryValuationProvider, useInventoryValuationContext };
