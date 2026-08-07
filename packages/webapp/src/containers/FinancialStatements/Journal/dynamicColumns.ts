import * as R from 'ramda';
import React from 'react';
import { useJournalSheetContext } from './JournalProvider';
import { Align, CLASSES } from '@/constants';
import { getColumnWidth } from '@/utils';

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
const transactionTypeColumnAccessor = (column: DynamicColumn) => {
  return {
    ...column,
    width: 120,
  };
};

/**
 * Transaction number column accessor.
 */
const transactionNumberColumnAccessor = (column: DynamicColumn) => {
  return {
    ...column,
    width: 70,
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
  (data: unknown[], column: DynamicColumn) => {
    const _commonAccessor = commonAccessor(data);
    const _numericColumnAccessor = numericColumnAccessor(data);

    return R.compose(
      R.when(R.pathEq(['key'], 'date'), dateColumnAccessor),
      R.when(
        R.pathEq(['key'], 'transaction_type'),
        transactionTypeColumnAccessor,
      ),
      R.when(
        R.pathEq(['key'], 'transaction_number'),
        transactionNumberColumnAccessor,
      ),
      R.when(R.pathEq(['key'], 'description'), descriptionColumnAccessor),
      R.when(R.pathEq(['key'], 'account_code'), accountCodeColumnAccessor),
      R.when(R.pathEq(['key'], 'credit'), _numericColumnAccessor),
      R.when(R.pathEq(['key'], 'debit'), _numericColumnAccessor),
      _commonAccessor,
    )(column);
  },
);

/**
 * Composes the fetched dynamic columns from the server to the columns to pass it
 * to the table component.
 */
export const dynamicColumns = (columns: DynamicColumn[], data: unknown[]) => {
  return R.map(dynamicColumnMapper(data), columns);
};

/**
 * Retrieves the table columns of journal sheet.
 */
export const useJournalSheetColumns = () => {
  const { journalSheet } = useJournalSheetContext();

  if (!journalSheet) {
    throw new Error('The journal sheet is not loaded');
  }
  const table = (journalSheet as any)?.table;

  return dynamicColumns(table.columns, table.rows);
};
