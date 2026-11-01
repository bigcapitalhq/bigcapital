import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import React from 'react';
import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import type { GeneralLedgerColumnKey } from '@bigcapital/sdk-ts';
import { Align, CLASSES } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

interface CellProps {
  cell: { value: React.ReactNode };
}

interface ColumnDef {
  key: string;
  label: string;
  cellIndex: number;
  [key: string]: unknown;
}

type CommonTableColumn = {
  key: string;
  Header: string;
  accessor: string;
  className: string;
  textOverview: boolean;
};

type ColumnMapper = (
  data: unknown[],
) => (column: ColumnDef) => CommonTableColumn;

type ColumnDecorator = (column: Record<string, any>) => Record<string, any>;

type ColumnMatcher = (
  column: Record<string, any>,
) => FO.Option<Record<string, any>>;

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

const isColumnKey =
  (key: GeneralLedgerColumnKey): FF.Predicate<Record<string, any>> =>
  (column) =>
    column.key === key;

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
const commonColumnMapper: ColumnMapper = (data) => (column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);

  return {
    key: column.key,
    Header: column.label,
    accessor,
    className: column.key,
    textOverview: true,
  };
};

/**
 * Numeric columns accessor.
 */
const numericColumnAccessor =
  (data: unknown[]): ColumnDecorator =>
  (column) => {
    const accessor = getTableCellValueAccessor(column.cellIndex);
    const width = getReportColWidth(data, accessor, column.label);

    return {
      ...column,
      align: Align.Right,
      width,
      money: true,
    };
  };

/**
 * Date column accessor.
 */
const dateColumnAccessor: ColumnDecorator = (column) => {
  return {
    ...column,
    width: 120,
  };
};

/**
 * Transaction type column accessor.
 */
const transactionTypeColumnAccessor =
  (onViewDetail?: (referenceType: string, referenceId: number) => void) =>
  (column: Record<string, any>): Record<string, any> => {
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
  (column: Record<string, any>): Record<string, any> => {
    return {
      ...column,
      width: 80,
      Cell: createTransactionLinkCell(onViewDetail),
    };
  };

/**
 * Description column accessor (muted text in wrapped cell).
 */
const descriptionColumnAccessor: ColumnDecorator = (column) => {
  return {
    ...column,
    Cell: DescriptionCell,
  };
};

const dynamicColumnMatchers = (
  onViewDetail: (referenceType: string, referenceId: number) => void,
  data: unknown[],
): ColumnMatcher[] => [
  when(isColumnKey('date'), dateColumnAccessor),
  when(
    isColumnKey('reference_type'),
    transactionTypeColumnAccessor(onViewDetail),
  ),
  when(
    isColumnKey('reference_number'),
    transactionIdColumnAccessor(onViewDetail),
  ),
  when(isColumnKey('description'), descriptionColumnAccessor),
  when(isColumnKey('credit'), numericColumnAccessor(data)),
  when(isColumnKey('debit'), numericColumnAccessor(data)),
  when(isColumnKey('amount'), numericColumnAccessor(data)),
  when(isColumnKey('running_balance'), numericColumnAccessor(data)),
];

const dynamiColumnMapper =
  (onViewDetail: (referenceType: string, referenceId: number) => void) =>
  (data: unknown[]) =>
  (column: ColumnDef): Record<string, any> => {
    const fallback = commonColumnMapper(data)(column);

    return FF.pipe(
      fallback,
      firstMatch(dynamicColumnMatchers(onViewDetail, data)),
      FO.match(() => fallback, FF.identity),
    );
  };

/**
 * Composes the dynamic columns that fetched from request to columns to table component.
 */
export const dynamicColumns = (
  onViewDetail: (referenceType: string, referenceId: number) => void,
  data: unknown[],
  columns: ColumnDef[],
) => {
  return FF.pipe(columns, FA.map(dynamiColumnMapper(onViewDetail)(data)));
};

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
