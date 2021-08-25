import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';

/**
 * Retrieve payment entries table columns.
 */
export const usePaymentReceiveEntriesColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: (row) => moment(row.payment_date).format('YYYY MMM DD'),
        width: 100,
        className: 'date',
        disableSortBy: true,
      },
      {
        Header: intl.get('invoice_no'),
        accessor: 'invoice.invoice_no',
        width: 150,
        className: 'invoice_number',
        disableSortBy: true,
      },
      {
        Header: intl.get('invoice_amount'),
        accessor: 'invoice.balance',
        className: 'invoice_amount',
      },
      {
        Header: intl.get('amount_due'),
        accessor: 'invoice.amount_due',
        className: 'amount_due',
        width: 100,
        disableSortBy: true,
      },
      {
        Header: intl.get('payment_amount'),
        accessor: 'invoice.payment_amount',
        className: 'payment_amount',
        width: 100,
        disableSortBy: true,
      },
    ],
    [],
  );
