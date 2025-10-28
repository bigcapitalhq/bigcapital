// @ts-nocheck
import React, { useMemo } from 'react';
import { castArray, uniq } from 'lodash';

interface CategorizeTransactionTabsValue {
  uncategorizedTransactionIds: Array<number>;
}

interface CategorizeTransactionTabsBootProps {
  uncategorizedTransactionIds: number | Array<number>;
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
  const uncategorizedTransactionIds = useMemo(
    () => uniq(castArray(uncategorizedTransactionId)),
    [uncategorizedTransactionId],
  );

  const provider = {
    uncategorizedTransactionIds,
  };
  // Use a key prop to force re-render of children when `uncategorizedTransactionIds` changes
  const childrenPerKey = React.useMemo(() => {
    return React.Children.map(children, (child) =>
      React.cloneElement(child, {
        key: uncategorizedTransactionIds?.join(','),
      }),
    );
  }, [children, uncategorizedTransactionIds]);

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
