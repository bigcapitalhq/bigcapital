import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';

import { FormatNumberCell } from '../../../components';

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
      accessor: 'bill.amount',
      Cell: FormatNumberCell,
      align: 'right',
    },
    {
      Header: intl.get('due_amount'),
      accessor: 'bill.due_amount',
      Cell: FormatNumberCell,
      width: 100,
      disableSortBy: true,
      align: 'right',
    },
    {
      Header: intl.get('payment_amount'),
      accessor: 'payment_amount',
      Cell: FormatNumberCell,
      width: 100,
      disableSortBy: true,
      align: 'right',
    },
  ], []);
