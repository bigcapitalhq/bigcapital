import React, { createContext, useContext } from 'react';
import { useInvoice } from 'hooks/query';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

const InvoiceDrawerContext = createContext();

/**
 * Invoice drawer provider.
 */
function InvoiceDrawerProvider({ invoiceId, ...props }) {
  // Fetch sale invoice details.
  const {
    data: { entries, ...invoice },
    isLoading: isInvoiceLoading,
  } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });
  // Provider payload.
  const provider = {
    invoiceId,
    invoice,
    entries,

    isInvoiceLoading,
  };

  return (
    <DashboardInsider loading={isInvoiceLoading}>
      <InvoiceDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}
const useInvoiceDrawerContext = () => useContext(InvoiceDrawerContext);

export { InvoiceDrawerProvider, useInvoiceDrawerContext };
