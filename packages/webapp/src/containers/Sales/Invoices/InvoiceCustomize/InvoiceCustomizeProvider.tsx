import React, { createContext, useContext } from 'react';

interface InvoiceCustomizeValue {
  PaperTemplate?: React.ReactNode;
  CustomizeTabs: React.ReactNode;
}

const InvoiceCustomizeContext = createContext<InvoiceCustomizeValue>(
  {} as InvoiceCustomizeValue,
);

export const InvoiceCustomizeProvider: React.FC<{
  value: InvoiceCustomizeValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <InvoiceCustomizeContext.Provider value={{ ...value }}>
      {children}
    </InvoiceCustomizeContext.Provider>
  );
};

export const useInvoiceCustomizeContext = (): InvoiceCustomizeValue => {
  const context = useContext<InvoiceCustomizeValue>(InvoiceCustomizeContext);

  if (!context) {
    throw new Error(
      'useInvoiceCustomize must be used within an InvoiceCustomizeProvider',
    );
  }
  return context;
};
