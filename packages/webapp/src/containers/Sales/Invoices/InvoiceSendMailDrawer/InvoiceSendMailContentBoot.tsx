// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { Spinner } from '@blueprintjs/core';
import { useInvoice } from '@/hooks/query';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

interface InvoiceSendMailBootValues {
  invoice: any;
  invoiceId: number;
  isInvoiceLoading: boolean;
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

  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });
  const isLoading = isInvoiceLoading;

  if (isLoading) {
    return <Spinner size={20} />;
  }
  const value = {
    invoice,
    isInvoiceLoading,
    invoiceId,
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
