import React from 'react';
import { DataTable, Card } from 'components';

import 'style/pages/PaymentTransactions/List.scss';

import { useInvoicePaymentTransactionsColumns } from './components';
import { useInvoiceDetailDrawerContext } from '../InvoiceDetailDrawerProvider';

/**
 * Invoice payment transactions datatable.
 */
export default function InvoicePaymentTransactionsTable() {
  const columns = useInvoicePaymentTransactionsColumns();
  const {
    paymentTransactions,
    isPaymentTransactionLoading,
    isPaymentTransactionFetching,
  } = useInvoiceDetailDrawerContext();

  return (
    <Card>
      <DataTable
        columns={columns}
        data={paymentTransactions}
        loading={isPaymentTransactionLoading}
        headerLoading={isPaymentTransactionLoading}
        progressBarLoading={isPaymentTransactionFetching}
        className={'payment-transactions'}
      />
    </Card>
  );
}
