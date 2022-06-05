import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { FormatNumberCell } from '../../../components';
import { getColumnWidth } from 'utils';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

/**
 * Retrieve payment entries table columns.
 */
export const usePaymentReceiveEntriesColumns = () => {
  const {
    paymentReceive: { entries },
  } = usePaymentReceiveDetailContext();

  return React.useMemo(
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
        Cell: FormatNumberCell,
        width: getColumnWidth(entries, 'invoice.balance', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        textOverview: true,
      },
      {
        Header: intl.get('amount_due'),
        accessor: 'invoice.due_amount',
        Cell: FormatNumberCell,
        align: 'right',
        width: getColumnWidth(entries, 'invoice.due_amount', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('payment_amount'),
        accessor: 'invoice.payment_amount',
        Cell: FormatNumberCell,
        align: 'right',
        width: getColumnWidth(entries, 'invoice.payment_amount', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        disableSortBy: true,
        textOverview: true,
      },
    ],
    [],
  );
};
