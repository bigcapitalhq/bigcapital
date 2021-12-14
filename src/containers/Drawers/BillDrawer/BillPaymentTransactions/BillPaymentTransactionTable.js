import React from 'react';
import { DataTable, Card } from 'components';

import 'style/pages/PaymentTransactions/List.scss';

import { useBillPaymentTransactionsColumns } from './components';
import { useBillDrawerContext } from '../BillDrawerProvider';
import { useBillPaymentTransactions } from 'hooks/query';

/**
 * Bill payment transactions datatable.
 */
export default function BillPaymentTransactionTable() {
  const columns = useBillPaymentTransactionsColumns();

  const { billId } = useBillDrawerContext();

  // Handle fetch bill payment transaction.
  const {
    isLoading: isPaymentTransactionsLoading,
    isFetching: isPaymentTransactionFetching,
    data: paymentTransactions,
  } = useBillPaymentTransactions(billId, {
    enabled: !!billId,
  });

  return (
    <Card>
      <DataTable
        columns={columns}
        data={paymentTransactions}
        loading={isPaymentTransactionsLoading}
        headerLoading={isPaymentTransactionsLoading}
        progressBarLoading={isPaymentTransactionFetching}
        className={'payment-transactions'}
      />
    </Card>
  );
}
