import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { Money } from 'components';
import { MoneyFieldCell } from 'components/DataTableCells';

function BillNumberAccessor(row) {
  return row?.bill_no ? row?.bill_no : '-';
}

function BillDateCell({ value }) {
  return moment(value).format('YYYY MMM DD');
}

/**
 * Mobey table cell.
 */
function MoneyTableCell({ row: { original }, value }) {
  return <Money amount={value} currency={original.currency_code} />;
}

/**
 * Payment made entries table columns
 */
export function usePaymentMadeEntriesTableColumns() {
  return React.useMemo(
    () => [
      {
        Header: intl.get('Date'),
        id: 'bill_date',
        accessor: 'bill_date',
        Cell: BillDateCell,
        disableSortBy: true,
        width: 250,
        className: 'bill_date',
      },
      {
        Header: intl.get('bill_number'),
        accessor: BillNumberAccessor,
        disableSortBy: true,
        className: 'bill_number',
      },
      {
        Header: intl.get('bill_amount'),
        accessor: 'amount',
        Cell: MoneyTableCell,
        disableSortBy: true,
        className: 'amount',
      },
      {
        Header: intl.get('amount_due'),
        accessor: 'due_amount',
        Cell: MoneyTableCell,
        disableSortBy: true,
        className: 'due_amount',
      },
      {
        Header: intl.get('payment_amount'),
        accessor: 'payment_amount',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        className: 'payment_amount',
      },
    ],
    [],
  );
}
