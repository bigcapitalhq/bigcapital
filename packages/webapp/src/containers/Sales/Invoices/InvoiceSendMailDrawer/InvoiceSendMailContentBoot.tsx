// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { Spinner } from '@blueprintjs/core';
import {
  GetSaleInvoiceDefaultOptionsResponse,
  useInvoice,
  useSaleInvoiceDefaultOptions,
} from '@/hooks/query';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

interface InvoiceSendMailBootValues {
  invoice: any;
  invoiceId: number;
  isInvoiceLoading: boolean;

  invoiceMailOptions: GetSaleInvoiceDefaultOptionsResponse | undefined;
  isInvoiceMailOptionsLoading: boolean;
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

  // Invoice details.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });
  // Invoice mail options.
  const { data: invoiceMailOptions, isLoading: isInvoiceMailOptionsLoading } =
    useSaleInvoiceDefaultOptions(invoiceId);

  const isLoading = isInvoiceLoading || isInvoiceMailOptionsLoading;

  if (isLoading) {
    return <Spinner size={20} />;
  }
  const value = {
    invoice,
    isInvoiceLoading,
    invoiceId,
    invoiceMailOptions,
    isInvoiceMailOptionsLoading,
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
