import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { safeSumBy, formattedAmount } from 'utils';

/**
 * Invoice date cell.
 */
function InvoiceDateCell({ value }) {
  return <span>{ moment(value).format('YYYY MMM DD') }</span>
}

/**
 * Index table cell.
 */
function IndexCell({ row: { index } }) {
  return (<span>{index + 1}</span>);
}

/**
 * Invoice number table cell accessor.
 */
function InvNumberCellAccessor(row) {
  const invNumber = row?.invoice_no || row?.id;
  return `#INV-${invNumber || ''}`;
}

/**
 * Balance footer cell.
 */
function BalanceFooterCell({ rows }) {
  const total = safeSumBy(rows, 'original.balance');
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
 * Retrieve payment receive form entries columns.
 */
export const usePaymentReceiveEntriesColumns = () => {
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
        Cell: IndexCell,
        width: 40,
        disableResizing: true,
        disableSortBy: true,
      },
      {
        Header: formatMessage({ id: 'Date' }),
        id: 'invoice_date',
        accessor: 'invoice_date',
        Cell: InvoiceDateCell,
        disableSortBy: true,
        disableResizing: true,
        width: 250,
      },
      {
        Header: formatMessage({ id: 'invocie_number' }),
        accessor: InvNumberCellAccessor,
        Cell: 'invoice_no',
        disableSortBy: true,
        className: '',
      },
      {
        Header: formatMessage({ id: 'invoice_amount' }),
        accessor: 'balance',
        Footer: BalanceFooterCell,
        disableSortBy: true,
        width: 100,
        className: '',
      },
      {
        Header: formatMessage({ id: 'amount_due' }),
        accessor: 'due_amount',
        Footer: DueAmountFooterCell,
        disableSortBy: true,
        width: 150,
        className: '',
      },
      {
        Header: formatMessage({ id: 'payment_amount' }),
        accessor: 'payment_amount',
        Footer: PaymentAmountFooterCell,
        disableSortBy: true,
        width: 150,
        className: '',
      },
    ],
    [formatMessage],
  )
}