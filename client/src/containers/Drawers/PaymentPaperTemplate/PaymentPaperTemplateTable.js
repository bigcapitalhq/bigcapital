import React from 'react';
import moment from 'moment';
import { formatMessage } from 'services/intl';
import { DataTable, Money } from 'components';

export default function PaymentPaperTemplateTable({ tableData }) {
  const columns = React.useMemo(
    () => [
      {
        Header: formatMessage({ id: 'invoice_number' }),
        accessor: 'invoice.invoice_no',
        disableSortBy: true,
      },
      {
        Header: formatMessage({ id: 'invoice_date' }),
        accessor: ({ invoice_date }) =>
          moment(invoice_date).format('YYYY MMM DD'),
        disableSortBy: true,
      },
      {
        Header: formatMessage({ id: 'invoice_amount' }),
        accessor: ({ invoice }) => (
          <Money amount={invoice.balance} currency={'USD'} />
        ),
        disableSortBy: true,
      },
      {
        Header: formatMessage({ id: 'payment_amount' }),
        accessor: ({ payment_amount }) => (
          <Money amount={payment_amount} currency={'USD'} />
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
