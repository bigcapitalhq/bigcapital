import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DashboardInsider } from 'components';
import { useTransactionsByReference } from 'hooks/query';

const InvoiceDetailDrawerContext = React.createContext();
/**
 * Invoice detail provider.
 */
function InvoiceDetailDrawerProvider({ invoiceId, ...props }) {
  // Handle fetch transaction by reference.
  const {
    data: { transactions },
    isLoading: isTransactionLoading,
  } = useTransactionsByReference(
    {
      reference_id: invoiceId,
      reference_type: 'SaleInvoice',
    },
    { enabled: !!invoiceId },
  );

  //provider.
  const provider = {
    transactions,
    invoiceId,
  };
  return (
    <DashboardInsider loading={isTransactionLoading}>
      <DrawerHeaderContent
        name="invoice-detail-drawer"
        title={intl.get('invoice_details')}
      />
      <InvoiceDetailDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useInvoiceDetailDrawerContext = () =>
  React.useContext(InvoiceDetailDrawerContext);

export { InvoiceDetailDrawerProvider, useInvoiceDetailDrawerContext };
