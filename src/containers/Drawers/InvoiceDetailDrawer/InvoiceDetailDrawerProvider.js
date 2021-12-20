import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from 'components';
import { useInvoice } from 'hooks/query';

const InvoiceDetailDrawerContext = React.createContext();
/**
 * Invoice detail provider.
 */
function InvoiceDetailDrawerProvider({ invoiceId, ...props }) {
  // Fetch sale invoice details.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

  // Provider.
  const provider = {
    invoiceId,
    invoice,
  };
  return (
    <DrawerLoading loading={isInvoiceLoading}>
      <DrawerHeaderContent
        name="invoice-detail-drawer"
        title={intl.get('invoice_details.drawer.title', {
          invoiceNumber: invoice.invoice_no,
        })}
      />
      <InvoiceDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useInvoiceDetailDrawerContext = () =>
  React.useContext(InvoiceDetailDrawerContext);

export { InvoiceDetailDrawerProvider, useInvoiceDetailDrawerContext };
