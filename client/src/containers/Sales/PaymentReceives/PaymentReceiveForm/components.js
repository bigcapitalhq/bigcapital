import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { Money } from 'components';
import { MoneyFieldCell } from 'components/DataTableCells';
import { safeSumBy, formattedAmount } from 'utils';
import { formatMessage } from 'services/intl';

/**
 * Invoice date cell.
 */
function InvoiceDateCell({ value }) {
  return <span>{moment(value).format('YYYY MMM DD')}</span>;
}

/**
 * Index table cell.
 */
function IndexCell({ row: { index } }) {
  return <span>{index + 1}</span>;
}

/**
 * Invoice number table cell accessor.
 */
function InvNumberCellAccessor(row) {
  return row?.invoice_no ? `#${row?.invoice_no || ''}` : '-';
}

/**
 * Balance footer cell.
 */
function BalanceFooterCell({ payload: { currencyCode }, rows }) {
  const total = safeSumBy(rows, 'original.amount');
  return <span>{formattedAmount(total, currencyCode)}</span>;
}

/**
 * Due amount footer cell.
 */
function DueAmountFooterCell({ payload: { currencyCode }, rows }) {
  const totalDueAmount = safeSumBy(rows, 'original.due_amount');
  return <span>{formattedAmount(totalDueAmount, currencyCode)}</span>;
}

/**
 * Payment amount footer cell.
 */
function PaymentAmountFooterCell({ payload: { currencyCode }, rows }) {
  const totalPaymentAmount = safeSumBy(rows, 'original.payment_amount');
  return <span>{formattedAmount(totalPaymentAmount, currencyCode)}</span>;
}

/**
 * Mobey table cell.
 */
function MoneyTableCell({ row: { original }, value }) {
  return <Money amount={value} currency={original.currency_code} />;
}

function DateFooterCell() {
  return formatMessage({id:'total'})
}

/**
 * Retrieve payment receive form entries columns.
 */
export const usePaymentReceiveEntriesColumns = () => {
 

  return React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
        Cell: IndexCell,
        width: 40,
        disableResizing: true,
        disableSortBy: true,
        className: 'index',
      },
      {
        Header: formatMessage({ id: 'Date' }),
        id: 'invoice_date',
        accessor: 'invoice_date',
        Cell: InvoiceDateCell,
        Footer: DateFooterCell,
        disableSortBy: true,
        disableResizing: true,
        width: 250,
        className: 'date',
      },
      {
        Header: formatMessage({ id: 'invocie_number' }),
        accessor: InvNumberCellAccessor,
        disableSortBy: true,
        className: 'invoice_number',
      },
      {
        Header: formatMessage({ id: 'invoice_amount' }),
        accessor: 'amount',
        Footer: BalanceFooterCell,
        Cell: MoneyTableCell,
        disableSortBy: true,
        width: 100,
        className: 'invoice_amount',
      },
      {
        Header: formatMessage({ id: 'amount_due' }),
        accessor: 'due_amount',
        Footer: DueAmountFooterCell,
        Cell: MoneyTableCell,
        disableSortBy: true,
        width: 150,
        className: 'amount_due',
      },
      {
        Header: formatMessage({ id: 'payment_amount' }),
        accessor: 'payment_amount',
        Cell: MoneyFieldCell,
        Footer: PaymentAmountFooterCell,
        disableSortBy: true,
        width: 150,
        className: 'payment_amount',
      },
    ],
    [formatMessage],
  );
};
