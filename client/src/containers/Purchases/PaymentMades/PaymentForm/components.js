import React from 'react';
import { useIntl } from "react-intl";
import moment from 'moment';
import { Money } from 'components';
import { safeSumBy, formattedAmount } from 'utils';
import { MoneyFieldCell } from 'components/DataTableCells';

function BillNumberAccessor(row) {
  return row?.bill_no ? row?.bill_no : '-';
}

function IndexTableCell({ row: { index } }) {
  return (<span>{index + 1}</span>);
}

function BillDateCell({ value }) {
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
 * Mobey table cell.
 */
function MoneyTableCell({ value }) {
  return <Money amount={value} currency={"USD"} />
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
        className: 'index'
      },
      {
        Header: formatMessage({ id: 'Date' }),
        id: 'bill_date',
        accessor: 'bill_date',
        Cell: BillDateCell,
        disableSortBy: true,
        width: 250,
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
        Cell: MoneyTableCell,
        Footer: AmountFooterCell,
        disableSortBy: true,
        className: '',
      },
      {
        Header: formatMessage({ id: 'amount_due' }),
        accessor: 'due_amount',
        Cell: MoneyTableCell,
        Footer: DueAmountFooterCell,
        disableSortBy: true,
        className: '',
      },
      {
        Header: formatMessage({ id: 'payment_amount' }),
        accessor: 'payment_amount',
        Cell: MoneyFieldCell,
        Footer: PaymentAmountFooterCell,
        disableSortBy: true,
        className: '',
      },
    ],
    [formatMessage],
  )
}