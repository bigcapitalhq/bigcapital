import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import React from 'react';
import { useJournalSheetContext } from './JournalProvider';
import type { JournalColumnKey } from '@bigcapital/sdk-ts';
import { Align, CLASSES } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

interface DescriptionCellProps {
  cell: { value: string };
}

type AlignValue = (typeof Align)[keyof typeof Align];

interface DynamicColumn {
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
  align: AlignValue;
};

type ColumnMapper = (
  data: unknown[],
) => (column: DynamicColumn) => CommonTableColumn;

type ColumnDecorator = (column: Record<string, any>) => Record<string, any>;

type ColumnMatcher = (
  column: Record<string, any>,
) => FO.Option<Record<string, any>>;

const isColumnKey =
  (key: JournalColumnKey): FF.Predicate<Record<string, any>> =>
  (column) =>
    column.key === key;

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

/**
 * Common column mapper.
 */
const commonAccessor: ColumnMapper = (data) => (column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);

  return {
    key: column.key,
    Header: column.label,
    accessor,
    className: column.key,
    textOverview: true,
    align: Align.Left,
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
      money: true,
      width,
    };
  };

/**
 * Date column accessor.
 */
const dateColumnAccessor: ColumnDecorator = (column) => {
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
  (column: Record<string, any>): Record<string, any> => {
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
  (column: Record<string, any>): Record<string, any> => {
    return {
      ...column,
      width: 70,
      Cell: createTransactionLinkCell(onViewDetail),
    };
  };

/**
 * Account code column accessor.
 */
const accountCodeColumnAccessor: ColumnDecorator = (column) => {
  return {
    ...column,
    width: 70,
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
    isColumnKey('transaction_type'),
    transactionTypeColumnAccessor(onViewDetail),
  ),
  when(
    isColumnKey('transaction_number'),
    transactionNumberColumnAccessor(onViewDetail),
  ),
  when(isColumnKey('description'), descriptionColumnAccessor),
  when(isColumnKey('account_code'), accountCodeColumnAccessor),
  when(isColumnKey('credit'), numericColumnAccessor(data)),
  when(isColumnKey('debit'), numericColumnAccessor(data)),
];

/**
 * Dynamic column mapper.
 */
const dynamicColumnMapper =
  (onViewDetail: (referenceType: string, referenceId: number) => void) =>
  (data: unknown[]) =>
  (column: DynamicColumn): Record<string, any> => {
    const fallback = commonAccessor(data)(column);

    return FF.pipe(
      fallback,
      firstMatch(dynamicColumnMatchers(onViewDetail, data)),
      FO.match(() => fallback, FF.identity),
    );
  };

/**
 * Composes the fetched dynamic columns from the server to the columns to pass it
 * to the table component.
 */
export const dynamicColumns = (
  onViewDetail: (referenceType: string, referenceId: number) => void,
  columns: DynamicColumn[],
  data: unknown[],
) => {
  return FF.pipe(columns, FA.map(dynamicColumnMapper(onViewDetail)(data)));
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
