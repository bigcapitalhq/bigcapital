// @ts-nocheck
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { CLASSES } from '@/constants/classes';
import { FormatDateCell } from '@/components';

export function useProjectPurchasesColumns() {
  return useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('purchases.column.date'),
        accessor: 'date',
        Cell: FormatDateCell,
        width: 120,
        className: 'date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'type',
        Header: intl.get('purchases.column.type'),
        accessor: 'type',
        width: 120,
        className: 'type',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'transaction_no',
        Header: intl.get('purchases.column.transaction_no'),
        accessor: 'transaction_no',
        width: 120,
      },
      {
        id: 'due_date',
        Header: intl.get('purchases.column.due_date'),
        accessor: 'due_date',
        Cell: FormatDateCell,
        width: 120,
        className: 'due_date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'balance',
        Header: intl.get('purchases.column.balance'),
        accessor: 'balance',
        width: 120,
        clickable: true,
        align: 'right',
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        id: 'total',
        Header: intl.get('purchases.column.total'),
        accessor: 'total',
        align: 'right',
        width: 120,
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        id: 'status',
        Header: intl.get('purchases.column.status'),
        accessor: 'status',
        width: 120,
        className: 'status',
        clickable: true,
      },
    ],
    [],
  );
}
