import * as R from 'ramda';
import React from 'react';
import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import type { GeneralLedgerColumnKey } from '@bigcapital/sdk-ts';
import { Align, CLASSES } from '@/constants';
import { getColumnWidth } from '@/utils';

interface CellProps {
  cell: { value: React.ReactNode };
}

interface ColumnDef {
  key: string;
  label: string;
  cellIndex: number;
  [key: string]: unknown;
}

/**
 * Description cell - wraps value in a div with muted text class.
 */
function DescriptionCell({ cell: { value } }: CellProps) {
  return React.createElement(
    'div',
    { className: `cell ${CLASSES.TEXT_MUTED}` },
    value,
  );
}

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const isColumnKey = (key: GeneralLedgerColumnKey) => R.pathEq(['key'], key);

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

/**
 * Account name column mapper.
 */
const commonColumnMapper = R.curry((data: unknown[], column: ColumnDef) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);

  return {
    key: column.key,
    Header: column.label,
    accessor,
    className: column.key,
    textOverview: true,
  };
});

/**
 * Numeric columns accessor.
 */
const numericColumnAccessor = R.curry((data: unknown[], column: ColumnDef) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);
  const width = getReportColWidth(data, accessor, column.label);

  return {
    ...column,
    align: Align.Right,
    width,
    money: true,
  };
});

/**
 * Date column accessor.
 */
const dateColumnAccessor = R.curry((column: ColumnDef) => {
  return {
    ...column,
    width: 120,
  };
});

/**
 * Transaction type column accessor.
 */
const transactionTypeColumnAccessor = (column: ColumnDef) => {
  return {
    ...column,
    width: 125,
  };
};

/**
 * Transaction number column accessor.
 */
const transactionIdColumnAccessor = (column: ColumnDef) => {
  return {
    ...column,
    width: 80,
  };
};

/**
 * Description column accessor (muted text in wrapped cell).
 */
const descriptionColumnAccessor = (column: ColumnDef) => {
  return {
    ...column,
    Cell: DescriptionCell,
  };
};

const dynamiColumnMapper = R.curry((data: unknown[], column: ColumnDef) => {
  const _numericColumnAccessor = numericColumnAccessor(data);

  return R.compose(
    R.when(isColumnKey('date'), dateColumnAccessor),
    R.when(isColumnKey('reference_type'), transactionTypeColumnAccessor),
    R.when(isColumnKey('reference_number'), transactionIdColumnAccessor),
    R.when(isColumnKey('description'), descriptionColumnAccessor),
    R.when(isColumnKey('credit'), _numericColumnAccessor),
    R.when(isColumnKey('debit'), _numericColumnAccessor),
    R.when(isColumnKey('amount'), _numericColumnAccessor),
    R.when(isColumnKey('running_balance'), _numericColumnAccessor),
    commonColumnMapper(data),
  )(column);
});

/**
 * Composes the dynamic columns that fetched from request to columns to table component.
 */
export const dynamicColumns = R.curry(
  (data: unknown[], columns: ColumnDef[]) => {
    return R.map(dynamiColumnMapper(data), columns);
  },
);

/**
 * Retrieves the G/L sheet table columns for table component.
 */
export const useGeneralLedgerTableColumns = () => {
  const { generalLedger } = useGeneralLedgerContext();

  if (!generalLedger) {
    throw new Error('General ledger data is not available');
  }
  const table = (generalLedger as any)?.table;

  return dynamicColumns(table.rows, table.columns);
};
