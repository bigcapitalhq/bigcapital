// @ts-nocheck
import React, { createContext } from 'react';

const ItemEntriesTableContext = createContext();

function ItemEntriesTableProvider({ children, value }) {
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
  React.useContext(ItemEntriesTableContext);

export { ItemEntriesTableProvider, useItemEntriesTableContext };
