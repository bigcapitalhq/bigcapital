import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from 'components';
import {
  useTransactionsByReference,
  useInvoice,
  useInvoicePaymentTransactions,
} from 'hooks/query';

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

  // Fetch sale invoice details.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

  // Fetch invoice payment transactions.
  const {
    data: paymentTransactions,
    isFetching: isPaymentTransactionFetching,
    isLoading: isPaymentTransactionLoading,
  } = useInvoicePaymentTransactions(invoiceId, {
    enabled: !!invoiceId,
  });

  //provider.
  const provider = {
    transactions,
    paymentTransactions,
    isPaymentTransactionLoading,
    isPaymentTransactionFetching,
    invoiceId,
    invoice,
  };
  return (
    <DrawerLoading
      loading={
        isTransactionLoading || isInvoiceLoading || isPaymentTransactionLoading
      }
    >
      <DrawerHeaderContent
        name="invoice-detail-drawer"
        title={intl.get('invoice_details')}
      />
      <InvoiceDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useInvoiceDetailDrawerContext = () =>
  React.useContext(InvoiceDetailDrawerContext);

export { InvoiceDetailDrawerProvider, useInvoiceDetailDrawerContext };
