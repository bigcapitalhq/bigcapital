import React, { createContext, useContext, useState } from 'react';

export enum InvoiceCustomizeTabsEnum {
  General = 'general',
  Items = 'items',
  Totals = 'totals'
}

const DEFAULT_TAB_ID = InvoiceCustomizeTabsEnum.General;

interface InvoiceCustomizeTabsControllerValue {
  currentTabId: InvoiceCustomizeTabsEnum;
  setCurrentTabId: React.Dispatch<
    React.SetStateAction<InvoiceCustomizeTabsEnum>
  >;
}

const InvoiceCustomizeTabsController = createContext(
  {} as InvoiceCustomizeTabsControllerValue,
);

export const useInvoiceCustomizeTabsController = () => {
  return useContext(InvoiceCustomizeTabsController);
};

interface InvoiceCustomizeTabsControllerProps {
  children: React.ReactNode;
}

export const InvoiceCustomizeTabsControllerProvider = ({
  children,
}: InvoiceCustomizeTabsControllerProps) => {
  const [currentTabId, setCurrentTabId] =
    useState<InvoiceCustomizeTabsEnum>(DEFAULT_TAB_ID);

  const value = {
    currentTabId,
    setCurrentTabId,
  };

  return (
    <InvoiceCustomizeTabsController.Provider value={value}>
      {children}
    </InvoiceCustomizeTabsController.Provider>
  );
};
