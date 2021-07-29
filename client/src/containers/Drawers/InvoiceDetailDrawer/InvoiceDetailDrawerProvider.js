import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DashboardInsider } from 'components';

const InvoiceDetailDrawerContext = React.createContext();
/**
 * Invoice detail provider.
 */
function InvoiceDetailDrawerProvider({ invoiceId, ...props }) {
  //provider.
  const provider = {};
  return (
    <DashboardInsider>
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
