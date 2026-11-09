import React, { createContext } from 'react';
import type { ItemEntry } from '@/interfaces/ItemEntries';
import type { TaxRate } from '@bigcapital/sdk-ts';

export interface ItemEntriesTableContextValue {
  /* Controlled value of the table. */
  value?: ItemEntry[];
  /* Initial value of the table when it is uncontrolled. */
  initialValue?: ItemEntry[];
  /* Callback fired once the table value changes. */
  onChange?: (entries: ItemEntry[]) => void;

  /* The current value of the table. */
  localValue: ItemEntry[];
  /* Handles the change of the table value. */
  handleChange: (entries: ItemEntry[]) => void;

  /* The default entry used to fill new table lines. */
  defaultEntry?: ItemEntry;
  /* The tax rates list. */
  taxRates?: TaxRate[];

  /* The minimum number of the table lines. */
  minLinesNumber?: number;
  /* Controls whether the tax rate column is displayed. */
  enableTaxRates?: boolean;
  /* The items list used on the item cell suggestions. */
  items?: unknown[];
  /* The type of the items entries (sellable/purchasable). */
  itemType?: string;
  /* The form errors of the table. */
  errors?: unknown;
  /* The number of the lines displayed once the table is empty. */
  linesNumber?: number;
  /* The currency code of the table values. */
  currencyCode?: string;
  /* Controls whether the tax is inclusive. */
  isInclusiveTax?: boolean;
  /* Controls whether the landed cost column is displayed. */
  landedCost?: boolean;
}

const ItemEntriesTableContext = createContext<
  ItemEntriesTableContextValue | undefined
>(undefined);

interface ItemEntriesTableProviderProps {
  children?: React.ReactNode;
  value: ItemEntriesTableContextValue;
}

function ItemEntriesTableProvider({
  children,
  value,
}: ItemEntriesTableProviderProps) {
  const provider = {
    ...value,
  };
  return (
    <ItemEntriesTableContext.Provider value={provider}>
      {children}
    </ItemEntriesTableContext.Provider>
  );
}

const useItemEntriesTableContext = () =>
  React.useContext(ItemEntriesTableContext) as ItemEntriesTableContextValue;

export { ItemEntriesTableProvider, useItemEntriesTableContext };
