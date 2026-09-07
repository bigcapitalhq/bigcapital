import React, { createContext, useContext } from 'react';
import type { ItemEntry } from '@/interfaces/ItemEntries';

export interface ItemEntriesTableContextValue {
  localValue: ItemEntry[];
  handleChange: (entries: ItemEntry[]) => void;
  defaultEntry?: Partial<ItemEntry>;
  items: unknown[];
  errors: unknown[];
  currencyCode?: string;
  landedCost?: boolean;
  taxRates: any[];
  itemType?: string;
  enableTaxRates?: boolean;
  minLinesNumber?: number;
  isInclusiveTax?: boolean;
}

const ItemEntriesTableContext =
  createContext<ItemEntriesTableContextValue | null>(null);

interface ItemEntriesTableProviderProps {
  children: React.ReactNode;
  value: ItemEntriesTableContextValue;
}

function ItemEntriesTableProvider({
  children,
  value,
}: ItemEntriesTableProviderProps) {
  return (
    <ItemEntriesTableContext.Provider value={value}>
      {children}
    </ItemEntriesTableContext.Provider>
  );
}

const useItemEntriesTableContext = () => {
  const context = useContext(ItemEntriesTableContext);
  if (!context) {
    throw new Error(
      'useItemEntriesTableContext must be used within ItemEntriesTableProvider.',
    );
  }
  return context;
};

export { ItemEntriesTableProvider, useItemEntriesTableContext };
