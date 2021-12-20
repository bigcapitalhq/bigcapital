import React from 'react';
import { DataTable, Card } from 'components';

import 'style/pages/PaymentTransactions/List.scss';

import { useInvoicePaymentTransactionsColumns } from './components';
import { useInvoiceDetailDrawerContext } from '../InvoiceDetailDrawerProvider';
import { useInvoicePaymentTransactions } from 'hooks/query';

import { TableStyle } from '../../../../common';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

/**
 * Invoice payment transactions datatable.
 */
export default function InvoicePaymentTransactionsTable() {
  // Retrieve invoice payment transactions columns.
  const columns = useInvoicePaymentTransactionsColumns();

  // Invoice drawer context.
  const { invoiceId } = useInvoiceDetailDrawerContext();

  // Fetch invoice payment transactions.
  const {
    data: paymentTransactions,
    isFetching: isPaymentTransactionFetching,
    isLoading: isPaymentTransactionLoading,
  } = useInvoicePaymentTransactions(invoiceId, {
    enabled: !!invoiceId,
  });

  return (
    <Card>
      <DataTable
        columns={columns}
        data={paymentTransactions}
        loading={isPaymentTransactionLoading}
        headerLoading={isPaymentTransactionLoading}
        progressBarLoading={isPaymentTransactionFetching}
        TableLoadingRenderer={TableSkeletonRows}
        styleName={TableStyle.Constrant}
      />
    </Card>
  );
}
