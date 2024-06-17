// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { getColumnWidth } from '@/utils';
import { FormatNumberCell } from '@/components';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

export const usePaymentMadeEntriesColumns = () => {
  // Payment made details context.
  const {
    paymentMade: { entries },
  } = usePaymentMadeDetailContext();

  return React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: 'bill.formatted_bill_date',
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
        width: getColumnWidth(entries, 'bill.amount', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
      },
      {
        Header: intl.get('due_amount'),
        accessor: 'bill.due_amount',
        Cell: FormatNumberCell,
        width: getColumnWidth(entries, 'bill.due_amount', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        disableSortBy: true,
        align: 'right',
      },
      {
        Header: intl.get('payment_amount'),
        accessor: 'payment_amount_formatted',
        width: getColumnWidth(entries, 'payment_amount_formatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        disableSortBy: true,
        textOverview: true,
        align: 'right',
      },
    ],
    [],
  );
};
