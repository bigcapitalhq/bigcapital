import React from 'react';
import { DataTable } from '../../../../components';
import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import { useItemAssociatedReceiptTransactions } from 'hooks/query';
import { useReceiptTransactionsColumns } from './components';

/**
 * Receipt payment transactions datatable.
 */
export default function ReceiptPaymentTransactions() {
  const columns = useReceiptTransactionsColumns();

  const { itemId } = useItemDetailDrawerContext();

  // Handle fetch receipts associated transactions.
  const {
    isLoading: isReceiptTransactionsLoading,
    isFetching: isReceiptTransactionFetching,
    data: paymentTransactions,
  } = useItemAssociatedReceiptTransactions(itemId, {
    enabled: !!itemId,
  });

  return (
    <DataTable
      columns={columns}
      data={paymentTransactions}
      loading={isReceiptTransactionsLoading}
      headerLoading={isReceiptTransactionsLoading}
      progressBarLoading={isReceiptTransactionFetching}
    />
  );
}
