import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';

import { Money } from 'components';
import { MoneyFieldCell } from 'components/DataTableCells';

/**
 * Invoice date cell.
 */
function InvoiceDateCell({ value }) {
  return <span>{moment(value).format('YYYY MMM DD')}</span>;
}

/**
 * Invoice number table cell accessor.
 */
function InvNumberCellAccessor(row) {
  return row?.invoice_no ? `#${row?.invoice_no || ''}` : '-';
}

/**
 * Mobey table cell.
 */
function MoneyTableCell({ row: { original }, value }) {
  return <Money amount={value} currency={original.currency_code} />;
}

/**
 * Retrieve payment receive form entries columns.
 */
export const usePaymentReceiveEntriesColumns = () => {
  return React.useMemo(
    () => [
      {
        Header: 'Invoice date',
        id: 'invoice_date',
        accessor: 'invoice_date',
        Cell: InvoiceDateCell,
        disableSortBy: true,
        disableResizing: true,
        width: 250,
        className: 'date',
      },
      {
        Header: intl.get('invocie_number'),
        accessor: InvNumberCellAccessor,
        disableSortBy: true,
        className: 'invoice_number',
      },
      {
        Header: intl.get('invoice_amount'),
        accessor: 'amount',
        Cell: MoneyTableCell,
        disableSortBy: true,
        width: 100,
        className: 'invoice_amount',
      },
      {
        Header: intl.get('amount_due'),
        accessor: 'due_amount',
        Cell: MoneyTableCell,
        disableSortBy: true,
        width: 150,
        className: 'amount_due',
      },
      {
        Header: intl.get('payment_amount'),
        accessor: 'payment_amount',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 150,
        className: 'payment_amount',
      },
    ],
    [],
  );
};
