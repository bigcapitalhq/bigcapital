import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';

export const usePaymentReceiveEntriesColumns = () =>
  React.useMemo(() => [
    {
      Header: intl.get('date'),
      accessor: (row) => moment(row.payment_date).format('YYYY MMM DD'),
      width: 100,
      disableSortBy: true,
    },
    {
      Header: intl.get('invoice_no'),
      accessor: 'invoice.invoice_no',
      width: 150,
      disableSortBy: true,
    },
    {
      Header: intl.get('invoice_amount'),
      accessor: 'invoice.balance',
    },
    {
      Header: intl.get('amount_due'),
      accessor: 'invoice.amount_due',
      width: 100,
      disableSortBy: true,
    },
    {
      Header: intl.get('payment_amount'),
      accessor: 'invoice.payment_amount',
      width: 100,
      disableSortBy: true,
    },
  ]);
