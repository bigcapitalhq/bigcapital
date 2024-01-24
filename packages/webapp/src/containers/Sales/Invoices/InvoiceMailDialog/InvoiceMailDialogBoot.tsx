// @ts-nocheck
import React, { createContext } from 'react';
import { useSaleInvoiceDefaultOptions } from '@/hooks/query';
import { DialogContent } from '@/components';

interface InvoiceMailDialogBootValues {
  invoiceId: number;
  mailOptions: any;
  redirectToInvoicesList: boolean;
}

const InvoiceMailDialagBoot = createContext<InvoiceMailDialogBootValues>();

interface InvoiceMailDialogBootProps {
  invoiceId: number;
  redirectToInvoicesList?: boolean;
  children: React.ReactNode;
}

/**
 * Invoice mail dialog boot provider.
 */
function InvoiceMailDialogBoot({
  invoiceId,
  redirectToInvoicesList,
  ...props
}: InvoiceMailDialogBootProps) {
  const { data: mailOptions, isLoading: isMailOptionsLoading } =
    useSaleInvoiceDefaultOptions(invoiceId);

  const provider = {
    saleInvoiceId: invoiceId,
    mailOptions,
    isMailOptionsLoading,
    redirectToInvoicesList,
  };

  return (
    <DialogContent isLoading={isMailOptionsLoading}>
      <InvoiceMailDialagBoot.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useInvoiceMailDialogBoot = () =>
  React.useContext<InvoiceMailDialogBootValues>(InvoiceMailDialagBoot);

export { InvoiceMailDialogBoot, useInvoiceMailDialogBoot };
