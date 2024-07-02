// @ts-nocheck
import React from 'react';
import { Spinner } from '@blueprintjs/core';
import { useUncategorizedTransaction } from '@/hooks/query';

interface CategorizeTransactionTabsValue {
  uncategorizedTransactionId: number;
  isUncategorizedTransactionLoading: boolean;
  uncategorizedTransaction: any;
}

interface CategorizeTransactionTabsBootProps {
  uncategorizedTransactionId: number;
  children: React.ReactNode;
}

const CategorizeTransactionTabsBootContext =
  React.createContext<CategorizeTransactionTabsValue>(
    {} as CategorizeTransactionTabsValue,
  );

/**
 * Categorize transcation tabs boot.
 */
export function CategorizeTransactionTabsBoot({
  uncategorizedTransactionId,
  children,
}: CategorizeTransactionTabsBootProps) {
  const {
    data: uncategorizedTransaction,
    isLoading: isUncategorizedTransactionLoading,
  } = useUncategorizedTransaction(uncategorizedTransactionId);

  const provider = {
    uncategorizedTransactionId,
    uncategorizedTransaction,
    isUncategorizedTransactionLoading,
  };
  const isLoading = isUncategorizedTransactionLoading;

  // Use a key prop to force re-render of children when uncategorizedTransactionId changes
  const childrenPerKey = React.useMemo(() => {
    return React.Children.map(children, (child) =>
      React.cloneElement(child, { key: uncategorizedTransactionId }),
    );
  }, [children, uncategorizedTransactionId]);

  if (isLoading) {
    return <Spinner size={30} />;
  }
  return (
    <CategorizeTransactionTabsBootContext.Provider value={provider}>
      {childrenPerKey}
    </CategorizeTransactionTabsBootContext.Provider>
  );
}

export const useCategorizeTransactionTabsBoot = () =>
  React.useContext<CategorizeTransactionTabsValue>(
    CategorizeTransactionTabsBootContext,
  );
