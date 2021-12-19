import React from 'react';
import { DataTable } from '../../../../components';
import { useItemAssociatedInvoiceTransactions } from 'hooks/query';
import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import { useInvoicePaymentTransactionsColumns } from './components';

/**
 * Invoice payment transactions datatable.
 */
export default function InvoicePaymentTransactionsTable() {
  const columns = useInvoicePaymentTransactionsColumns();

  const { itemId } = useItemDetailDrawerContext();

  // Handle fetch invoice associated transactions.
  const {
    isLoading: isInvoiceTransactionsLoading,
    isFetching: isInvoiceTransactionFetching,
    data: paymentTransactions,
  } = useItemAssociatedInvoiceTransactions(itemId, {
    enabled: !!itemId,
  });

  return (
    <DataTable
      columns={columns}
      data={paymentTransactions}
      loading={isInvoiceTransactionsLoading}
      headerLoading={isInvoiceTransactionsLoading}
      progressBarLoading={isInvoiceTransactionFetching}
    />
  );
}
