import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { DataTable, Money } from '@/components';

export default function PaymentPaperTemplateTable({ tableData, currencyCode }) {
  const columns = React.useMemo(
    () => [
      {
        Header: intl.get('invoice_number'),
        accessor: 'invoice.invoice_no',
        disableSortBy: true,
      },
      {
        Header: intl.get('invoice_date'),
        accessor: ({ invoice_date }) =>
          moment(invoice_date).format('YYYY MMM DD'),
        disableSortBy: true,
      },
      {
        Header: intl.get('invoice_amount'),
        accessor: ({ invoice }) => (
          <Money amount={invoice.balance} currency={currencyCode} />
        ),
        disableSortBy: true,
      },
      {
        Header: intl.get('payment_amount'),
        accessor: ({ payment_amount }) => (
          <Money amount={payment_amount} currency={currencyCode} />
        ),
        disableSortBy: true,
      },
    ],
    [],
  );
  return (
    <div className="template__table">
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
