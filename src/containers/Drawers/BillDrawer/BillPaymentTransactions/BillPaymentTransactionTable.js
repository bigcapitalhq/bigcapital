import React from 'react';
import { DataTable, Card } from 'components';

import 'style/pages/PaymentTransactions/List.scss';

import { useBillPaymentTransactionsColumns } from './components';
import { useBillDrawerContext } from '../BillDrawerProvider';

/**
 * Bill payment transactions datatable.
 */
export default function BillPaymentTransactionTable() {
  const columns = useBillPaymentTransactionsColumns();

  const {
    paymentTransactions,
    isPaymentTransactionsLoading,
    isPaymentTransactionFetching,
  } = useBillDrawerContext();

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
