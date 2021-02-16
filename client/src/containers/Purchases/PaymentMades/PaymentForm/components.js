import React from 'react';
import { useIntl } from "react-intl";
import moment from 'moment';
import { Money } from 'components';
import { safeSumBy, formattedAmount } from 'utils';

function BillNumberAccessor(row) {
  return `#${row?.bill_number || ''}`
}

function IndexTableCell({ row: { index } }) {
  return (<span>{index + 1}</span>);
}

function BillDateTableCell({ value }) {
  return moment(value).format('YYYY MMM DD');
}
/**
 * Balance footer cell.
 */
function AmountFooterCell({ rows }) {
  const total = safeSumBy(rows, 'original.amount');
  return <span>{ formattedAmount(total, 'USD') }</span>;
}

/**
 * Due amount footer cell.
 */
function DueAmountFooterCell({ rows }) {
  const totalDueAmount = safeSumBy(rows, 'original.due_amount');
  return <span>{ formattedAmount(totalDueAmount, 'USD') }</span>;
}

/**
 * Payment amount footer cell.
 */
function PaymentAmountFooterCell({ rows }) {
  const totalPaymentAmount = safeSumBy(rows, 'original.payment_amount');
  return <span>{ formattedAmount(totalPaymentAmount, 'USD') }</span>;
}

/**
 * Payment made entries table columns
 */
export function usePaymentMadeEntriesTableColumns() {
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
        Cell: IndexTableCell,
        width: 40,
        disableResizing: true,
        disableSortBy: true,
      },
      {
        Header: formatMessage({ id: 'Date' }),
        id: 'bill_date',
        accessor: 'bill_date',
        Cell: BillDateTableCell,
        disableSortBy: true,
      },
      {
        Header: formatMessage({ id: 'bill_number' }),
        accessor: BillNumberAccessor,
        disableSortBy: true,
        className: 'bill_number',
      },
      {
        Header: formatMessage({ id: 'bill_amount' }),
        accessor: 'amount',
        Footer: AmountFooterCell,
        disableSortBy: true,
        className: '',
      },
      {
        Header: formatMessage({ id: 'amount_due' }),
        accessor: 'due_amount',
        Footer: DueAmountFooterCell,
        disableSortBy: true,
        className: '',
      },
      {
        Header: formatMessage({ id: 'payment_amount' }),
        accessor: 'payment_amount',
        Footer: PaymentAmountFooterCell,
        disableSortBy: true,
        className: '',
      },
    ],
    [formatMessage],
  )
}