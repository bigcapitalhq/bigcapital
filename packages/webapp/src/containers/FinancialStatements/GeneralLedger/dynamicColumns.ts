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
const transactionTypeColumnAccessor =
  (onViewDetail?: (referenceType: string, referenceId: number) => void) =>
  (column: ColumnDef) => {
    return {
      ...column,
      width: 125,
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
const transactionIdColumnAccessor =
  (onViewDetail?: (referenceType: string, referenceId: number) => void) =>
  (column: ColumnDef) => {
    return {
      ...column,
      width: 80,
      Cell: createTransactionLinkCell(onViewDetail),
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

const dynamiColumnMapper = R.curry(
  (
    onViewDetail: (referenceType: string, referenceId: number) => void,
    data: unknown[],
    column: ColumnDef,
  ) => {
    const _numericColumnAccessor = numericColumnAccessor(data);
    const _transactionIdColumnAccessor =
      transactionIdColumnAccessor(onViewDetail);

    return R.compose(
      R.when(isColumnKey('date'), dateColumnAccessor),
      R.when(
        isColumnKey('reference_type'),
        transactionTypeColumnAccessor(onViewDetail),
      ),
      R.when(isColumnKey('reference_number'), _transactionIdColumnAccessor),
      R.when(isColumnKey('description'), descriptionColumnAccessor),
      R.when(isColumnKey('credit'), _numericColumnAccessor),
      R.when(isColumnKey('debit'), _numericColumnAccessor),
      R.when(isColumnKey('amount'), _numericColumnAccessor),
      R.when(isColumnKey('running_balance'), _numericColumnAccessor),
      commonColumnMapper(data),
    )(column);
  },
);

/**
 * Composes the dynamic columns that fetched from request to columns to table component.
 */
export const dynamicColumns = R.curry(
  (
    onViewDetail: (referenceType: string, referenceId: number) => void,
    data: unknown[],
    columns: ColumnDef[],
  ) => {
    return R.map(dynamiColumnMapper(onViewDetail, data), columns);
  },
);

/**
 * Retrieves the G/L sheet table columns for table component.
 */
export const useGeneralLedgerTableColumns = (
  onViewDetail: (referenceType: string, referenceId: number) => void,
) => {
  const { generalLedger } = useGeneralLedgerContext();

  if (!generalLedger) {
    throw new Error('General ledger data is not available');
  }
  const table = (generalLedger as any)?.table;

  return dynamicColumns(onViewDetail, table.rows, table.columns);
};
