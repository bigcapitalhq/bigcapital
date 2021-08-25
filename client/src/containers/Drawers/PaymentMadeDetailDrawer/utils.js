import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';

export const usePaymentMadeEntriesColumns = () =>
  React.useMemo(() => [
    {
      Header: intl.get('date'),
      accessor: (row) => moment(row.date).format('YYYY MMM DD'),
      width: 100,
      disableSortBy: true,
      className: 'date',
    },
    {
      Header: intl.get('bill_number'),
      accessor: 'bill_no',
      width: 150,
      disableSortBy: true,
      className: 'bill_number',
    },
    {
      Header: intl.get('bill_amount'),
      accessor: 'amount',
      className: 'amount',
    },
    {
      Header: intl.get('due_amount'),
      accessor: 'due_amount',
      width: 100,
      disableSortBy: true,
      className: 'due_amount',
    },
    {
      Header: intl.get('payment_amount'),
      accessor: 'payment_amount',
      width: 100,
      disableSortBy: true,
      className: 'payment_amount',
    },
  ], []);
