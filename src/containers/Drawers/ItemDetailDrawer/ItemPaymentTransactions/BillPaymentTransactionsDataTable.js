import React from 'react';
import { DataTable } from '../../../../components';
import { useItemDetailDrawerContext } from '../ItemDetailDrawerProvider';
import { useItemAssociatedBillTransactions } from 'hooks/query';
import { useBillTransactionsColumns } from './components';

/**
 * Bill payment transactions data table.
 */
export default function BillPaymentTransactions() {
  const columns = useBillTransactionsColumns();

  const { itemId } = useItemDetailDrawerContext();

  // Handle fetch Estimate associated transactions.
  const {
    isLoading: isBillTransactionsLoading,
    isFetching: isBillTransactionFetching,
    data: paymentTransactions,
  } = useItemAssociatedBillTransactions(itemId, {
    enabled: !!itemId,
  });

  return (
    <DataTable
      columns={columns}
      data={paymentTransactions}
      loading={isBillTransactionsLoading}
      headerLoading={isBillTransactionsLoading}
      progressBarLoading={isBillTransactionFetching}
    />
  );
}
