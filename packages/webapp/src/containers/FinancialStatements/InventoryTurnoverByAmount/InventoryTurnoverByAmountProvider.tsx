import React, { createContext, useContext, useMemo } from 'react';
import { transformFilterFormToQuery } from '../common';
import { FinancialReportPage } from '../FinancialReportPage';
import { useInventoryTurnoverByAmountTable } from '@/hooks/query';

type UseInventoryTurnoverByAmountTableResult = ReturnType<
  typeof useInventoryTurnoverByAmountTable
>;

type InventoryTurnoverByAmountContextValue = {
  inventoryTurnoverByAmount: UseInventoryTurnoverByAmountTableResult['data'];
  isFetching: boolean;
  isLoading: boolean;
  refetchSheet: UseInventoryTurnoverByAmountTableResult['refetch'];
  httpQuery: Record<string, unknown>;
  query: Record<string, unknown>;
};

type InventoryTurnoverByAmountProviderProps = {
  query: Record<string, unknown>;
  children?: React.ReactNode;
};

const InventoryTurnoverByAmountContext = createContext<
  InventoryTurnoverByAmountContextValue | undefined
>(undefined);

/**
 * Inventory turnover by amount provider.
 */
function InventoryTurnoverByAmountProvider({
  query,
  ...props
}: InventoryTurnoverByAmountProviderProps) {
  const httpQuery = useMemo(
    () => transformFilterFormToQuery(query) as Record<string, unknown>,
    [query],
  );

  const {
    data: inventoryTurnoverByAmount,
    isFetching,
    isLoading,
    refetch,
  } = useInventoryTurnoverByAmountTable(httpQuery, {
    placeholderData: (previousData) => previousData,
  });

  const provider: InventoryTurnoverByAmountContextValue = {
    inventoryTurnoverByAmount,
    isFetching,
    isLoading,
    refetchSheet: refetch,
    httpQuery,
    query,
  };

  return (
    <FinancialReportPage name={'inventory-turnover-by-amount'}>
      <InventoryTurnoverByAmountContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useInventoryTurnoverByAmountContext =
  (): InventoryTurnoverByAmountContextValue => {
    const ctx = useContext(InventoryTurnoverByAmountContext);
    if (!ctx) {
      throw new Error(
        'useInventoryTurnoverByAmountContext must be used within InventoryTurnoverByAmountProvider',
      );
    }
    return ctx;
  };

export {
  InventoryTurnoverByAmountProvider,
  useInventoryTurnoverByAmountContext,
};
