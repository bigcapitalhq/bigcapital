import React, { createContext, useContext } from 'react';
import { Spinner } from '@blueprintjs/core';

interface InvoiceSendMailBootValues {}
interface InvoiceSendMailBootProps {
  children: React.ReactNode;
}

const InvoiceSendMailContentBootContext =
  createContext<InvoiceSendMailBootValues>({} as InvoiceSendMailBootValues);

export const InvoiceSendMailBoot = ({ children }: InvoiceSendMailBootProps) => {
  const isLoading = false;

  if (isLoading) {
    return <Spinner size={20} />;
  }
  const value = {};

  return (
    <InvoiceSendMailContentBootContext.Provider value={value}>
      {children}
    </InvoiceSendMailContentBootContext.Provider>
  );
};
InvoiceSendMailBoot.displayName = 'InvoiceSendMailBoot';

export const useInvoiceSendMailBoot = () => {
  return useContext<InvoiceSendMailBootValues>(
    InvoiceSendMailContentBootContext,
  );
};
