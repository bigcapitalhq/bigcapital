import { castArray, uniq } from 'lodash';
import React, { useMemo } from 'react';

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
  uncategorizedTransactionIds,
  children,
}: CategorizeTransactionTabsBootProps) {
  const normalizedIds = useMemo(
    () => uniq(castArray(uncategorizedTransactionIds)),
    [uncategorizedTransactionIds],
  );

  const provider: CategorizeTransactionTabsValue = {
    uncategorizedTransactionIds: normalizedIds,
  };
  // Use a key prop to force re-render of children when `uncategorizedTransactionIds` changes
  const childrenPerKey = React.useMemo(() => {
    return React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child, {
            key: normalizedIds?.join(','),
          })
        : child,
    );
  }, [children, normalizedIds]);

  return (
    <CategorizeTransactionTabsBootContext.Provider value={provider}>
      {childrenPerKey}
    </CategorizeTransactionTabsBootContext.Provider>
  );
}

export const useCategorizeTransactionTabsBoot = () =>
  React.useContext(CategorizeTransactionTabsBootContext);
