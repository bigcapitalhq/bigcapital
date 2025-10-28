import React, { createContext, useContext } from 'react';
import { Spinner } from '@blueprintjs/core';
import {
  GetSaleInvoiceDefaultOptionsResponse,
  useSaleInvoiceMailState,
} from '@/hooks/query';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

interface InvoiceSendMailBootValues {
  invoiceId: number;

  invoiceMailState: GetSaleInvoiceDefaultOptionsResponse | undefined;
  isInvoiceMailState: boolean;
}
interface InvoiceSendMailBootProps {
  children: React.ReactNode;
}

const InvoiceSendMailContentBootContext =
  createContext<InvoiceSendMailBootValues>({} as InvoiceSendMailBootValues);

export const InvoiceSendMailBoot = ({ children }: InvoiceSendMailBootProps) => {
  const {
    payload: { invoiceId },
  } = useDrawerContext();

  // Invoice mail options.
  const { data: invoiceMailState, isLoading: isInvoiceMailState } =
    useSaleInvoiceMailState(invoiceId);

  const isLoading = isInvoiceMailState;

  if (isLoading) {
    return <Spinner size={20} />;
  }
  const value = {
    invoiceId,

    // # Invoice mail options
    isInvoiceMailState,
    invoiceMailState,
  };

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
