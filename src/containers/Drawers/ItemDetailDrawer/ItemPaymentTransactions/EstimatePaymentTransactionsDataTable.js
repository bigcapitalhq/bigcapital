import React from 'react';
import { DataTable } from '../../../../components';
import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import { useItemAssociatedEstimateTransactions } from 'hooks/query';
import { useEstimateTransactionsColumns } from './components';

/**
 * Esimtate payment transactions datatable.
 */
export default function EstimatePaymentTransactions() {
  const columns = useEstimateTransactionsColumns();

  const { itemId } = useItemDetailDrawerContext();

  // Handle fetch Estimate associated transactions.
  const {
    isLoading: isEstimateTransactionsLoading,
    isFetching: isEstimateTransactionFetching,
    data: paymentTransactions,
  } = useItemAssociatedEstimateTransactions(itemId, {
    enabled: !!itemId,
  });

  return (
    <DataTable
      columns={columns}
      data={paymentTransactions}
      loading={isEstimateTransactionsLoading}
      headerLoading={isEstimateTransactionsLoading}
      progressBarLoading={isEstimateTransactionFetching}
    />
  );
}
