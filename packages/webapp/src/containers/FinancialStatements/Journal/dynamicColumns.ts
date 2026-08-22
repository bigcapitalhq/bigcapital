import * as R from 'ramda';
import React from 'react';
import { useJournalSheetContext } from './JournalProvider';
import type { JournalColumnKey } from '@bigcapital/sdk-ts';
import { Align, CLASSES } from '@/constants';
import { getColumnWidth } from '@/utils';

const isColumnKey = (key: JournalColumnKey) => R.pathEq(['key'], key);

interface DescriptionCellProps {
  cell: { value: string };
}

/**
 * Description cell - wraps value in a div with muted text class.
 */
function DescriptionCell({ cell: { value } }: DescriptionCellProps) {
  return React.createElement(
    'span',
    { className: `cell ${CLASSES.TEXT_MUTED}` },
    value,
  );
}

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const getReportColWidth = (
  data: unknown[],
  accessor: string,
  headerText: string,
) => {
  return getColumnWidth(
    data,
    accessor,
    { magicSpacing: 10, minWidth: 100 },
    headerText,
  );
};

interface DynamicColumn {
  key: string;
  label: string;
  cellIndex: number;
  [key: string]: unknown;
}

/**
 * Common column mapper.
 */
const commonAccessor = R.curry((data: unknown[], column: DynamicColumn) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);

  return {
    key: column.key,
    Header: column.label,
    accessor,
    className: column.key,
    textOverview: true,
    align: Align.Left,
  };
});

/**
 * Numeric columns accessor.
 */
const numericColumnAccessor = R.curry(
  (data: unknown[], column: DynamicColumn) => {
    const accessor = getTableCellValueAccessor(column.cellIndex);
    const width = getReportColWidth(data, accessor, column.label);

    return {
      ...column,
      align: Align.Right,
      money: true,
      width,
    };
  },
);

/**
 * Date column accessor.
 */
const dateColumnAccessor = (column: DynamicColumn) => {
  return {
    ...column,
    width: 100,
  };
};

/**
 * Transaction type column accessor.
 */
const transactionTypeColumnAccessor =
  (onViewDetail?: (referenceType: string, referenceId: number) => void) =>
  (column: DynamicColumn) => {
    return {
      ...column,
      width: 120,
      Cell: createTransactionLinkCell(onViewDetail),
    };
  };

/**
 * Transaction number cell - renders the reference number as a link that opens
 * the underlying transaction detail drawer.
 */
const createTransactionLinkCell = (
  onViewDetail?: (referenceType: string, referenceId: number) => void,
) => {
  return function TransactionLinkCell({ cell }: any) {
    const { value, row } = cell;
    const { referenceType, referenceId } = row?.original?.meta ?? {};

    if (!referenceType || !referenceId) {
      return React.createElement('span', null, value);
    }
    const handleClick = (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onViewDetail?.(referenceType, referenceId);
    };

    return React.createElement(
      'a',
      { className: CLASSES.TEXT_LINK, onClick: handleClick },
      value,
    );
  };
};

/**
 * Transaction number column accessor.
 */
const transactionNumberColumnAccessor =
  (onViewDetail?: (referenceType: string, referenceId: number) => void) =>
  (column: DynamicColumn) => {
    return {
      ...column,
      width: 70,
      Cell: createTransactionLinkCell(onViewDetail),
    };
  };

/**
 * Account code column accessor.
 */
const accountCodeColumnAccessor = (column: DynamicColumn) => {
  return {
    ...column,
    width: 70,
  };
};

/**
 * Description column accessor (muted text in wrapped cell).
 */
const descriptionColumnAccessor = (column: DynamicColumn) => {
  return {
    ...column,
    Cell: DescriptionCell,
  };
};

/**
 * Dynamic column mapper.
 */
const dynamicColumnMapper = R.curry(
  (
    onViewDetail: (referenceType: string, referenceId: number) => void,
    data: unknown[],
    column: DynamicColumn,
  ) => {
    const _commonAccessor = commonAccessor(data);
    const _numericColumnAccessor = numericColumnAccessor(data);
    const _transactionNumberColumnAccessor =
      transactionNumberColumnAccessor(onViewDetail);

    return R.compose(
      R.when(isColumnKey('date'), dateColumnAccessor),
      R.when(
        isColumnKey('transaction_type'),
        transactionTypeColumnAccessor(onViewDetail),
      ),
      R.when(
        isColumnKey('transaction_number'),
        _transactionNumberColumnAccessor,
      ),
      R.when(isColumnKey('description'), descriptionColumnAccessor),
      R.when(isColumnKey('account_code'), accountCodeColumnAccessor),
      R.when(isColumnKey('credit'), _numericColumnAccessor),
      R.when(isColumnKey('debit'), _numericColumnAccessor),
      _commonAccessor,
    )(column);
  },
);

/**
 * Composes the fetched dynamic columns from the server to the columns to pass it
 * to the table component.
 */
export const dynamicColumns = (
  onViewDetail: (referenceType: string, referenceId: number) => void,
  columns: DynamicColumn[],
  data: unknown[],
) => {
  return R.map(dynamicColumnMapper(onViewDetail, data), columns);
};

/**
 * Retrieves the table columns of journal sheet.
 */
export const useJournalSheetColumns = (
  onViewDetail: (referenceType: string, referenceId: number) => void,
) => {
  const { journalSheet } = useJournalSheetContext();

  if (!journalSheet) {
    throw new Error('The journal sheet is not loaded');
  }
  const table = (journalSheet as any)?.table;

  return dynamicColumns(onViewDetail, table.columns, table.rows);
};
