import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import { isEmpty } from 'lodash';
import type { BalanceSheetColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

type AlignValue = (typeof Align)[keyof typeof Align];

interface ReportTableColumn {
  key: string;
  label: string;
  cellIndex?: number;
  children?: ReportTableColumn[];
}

interface TableColumn {
  key: string;
  Header: string;
  accessor?: string;
  className?: string;
  textOverview?: boolean;
  width?: number;
  sticky?: AlignValue;
  align?: AlignValue;
  disableSortBy?: boolean;
  money?: boolean;
  columns?: TableColumn[];
}

type ColumnMapper = (
  data: unknown[],
) => (column: ReportTableColumn) => TableColumn;

type ColumnMatcher = (column: ReportTableColumn) => FO.Option<TableColumn>;

const getTableCellValueAccessor = (index?: number) => `cells[${index}].value`;

const getReportColWidth = (
  data: unknown[],
  accessor: string,
  headerText?: string,
): number => {
  return getColumnWidth(
    data,
    accessor,
    { magicSpacing: 12, minWidth: 100 },
    headerText,
  );
};

/**
 * Account name column mapper.
 */
const accountNameMapper: ColumnMapper = (data) => (column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);
  const width = getReportColWidth(data, accessor, column.label);

  return {
    key: column.key,
    Header: column.label,
    accessor,
    className: column.key,
    textOverview: true,
    width: Math.max(width, 300),
    sticky: Align.Left,
  };
};

/**
 * Shared money column mapper.
 */
const moneyColumnMapper: ColumnMapper = (data) => (column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);
  const width = getReportColWidth(data, accessor, column.label);

  return {
    Header: column.label,
    key: column.key,
    accessor,
    width,
    align: Align.Right,
    disableSortBy: true,
    textOverview: true,
    money: true,
  };
};

/**
 * Determines whether the given column matches the given key.
 */
const isColumnKey =
  (key: BalanceSheetColumnKey): FF.Predicate<ReportTableColumn> =>
  (column) =>
    column.key === key;

/**
 * Determines whether the given string starts with `date-range`.
 */
const isMatchesDateRange = (key: string): boolean => /^date-range/.test(key);

const isDateRangeColumn: FF.Predicate<ReportTableColumn> = (column) =>
  isMatchesDateRange(column.key);

/**
 * Total sub-columns composer.
 */
const totalColumnsComposer = (
  data: unknown[],
  column: ReportTableColumn,
): TableColumn[] => {
  return FF.pipe(column.children ?? [], FA.map(totalColumnsMapper(data)));
};

/**
 * Assoc columns to total column.
 */
const assocColumnsToTotal =
  (data: unknown[], column: ReportTableColumn) =>
  (columnAccessor: TableColumn): TableColumn => ({
    ...columnAccessor,
    columns: totalColumnsComposer(data, column),
  });

/**
 * Assoc the solo date-range column attributes.
 */
const assocDateRangeSoloAttrs =
  (data: unknown[], column: ReportTableColumn) =>
  (columnAccessor: TableColumn): TableColumn => {
    const accessor = getTableCellValueAccessor(column.cellIndex);

    return {
      ...columnAccessor,
      accessor,
      width: getReportColWidth(data, accessor),
    };
  };

/**
 * Total column mapper.
 */
const totalMapper: ColumnMapper = (data) => (column) => {
  const hasChildren = !isEmpty(column.children);
  const accessor = getTableCellValueAccessor(column.cellIndex);
  const width = getReportColWidth(data, accessor, column.label);

  const base: TableColumn = {
    key: column.key,
    Header: column.label,
    accessor,
    textOverview: true,
    width,
    disableSortBy: true,
    money: true,
    align: hasChildren ? Align.Center : Align.Right,
  };

  return FF.pipe(
    base,
    FO.fromPredicate(FF.constant(hasChildren)),
    FO.map(assocColumnsToTotal(data, column)),
    FO.match(() => base, FF.identity),
  );
};

/**
 * Date range columns mapper.
 */
const dateRangeMapper: ColumnMapper = (data) => (column) => {
  const hasChildren = !isEmpty(column.children);

  const base: TableColumn = {
    Header: column.label,
    key: column.key,
    disableSortBy: true,
    textOverview: true,
    money: true,
    align: hasChildren ? Align.Center : Align.Right,
  };

  return FF.pipe(
    base,
    FO.fromPredicate(FF.constant(hasChildren)),
    FO.map(assocColumnsToTotal(data, column)),
    FO.alt(() =>
      FF.pipe(
        base,
        FO.fromPredicate(FF.constant(!hasChildren)),
        FO.map(assocDateRangeSoloAttrs(data, column)),
      ),
    ),
    FO.match(() => base, FF.identity),
  );
};

/**
 * Fallback column mapper for keys matching no conditional mapper.
 */
const fallbackColumnMapper = (column: ReportTableColumn): TableColumn => ({
  key: column.key,
  Header: column.label,
  accessor: getTableCellValueAccessor(column.cellIndex),
});

/**
 * Total sub-columns conditional mappers.
 */
const totalColumnMatchers = (data: unknown[]): ColumnMatcher[] => [
  when(isColumnKey('total'), totalMapper(data)),
  // Percentage of column/row.
  when(isColumnKey('percentage_of_column'), moneyColumnMapper(data)),
  when(isColumnKey('percentage_of_row'), moneyColumnMapper(data)),
  // Previous year.
  when(isColumnKey('previous_year'), moneyColumnMapper(data)),
  when(isColumnKey('previous_year_change'), moneyColumnMapper(data)),
  when(isColumnKey('previous_year_percentage'), moneyColumnMapper(data)),
  // Previous period.
  when(isColumnKey('previous_period'), moneyColumnMapper(data)),
  when(isColumnKey('previous_period_change'), moneyColumnMapper(data)),
  when(isColumnKey('previous_period_percentage'), moneyColumnMapper(data)),
];

const totalColumnsMapper =
  (data: unknown[]) =>
  (column: ReportTableColumn): TableColumn =>
    FF.pipe(
      column,
      firstMatch(totalColumnMatchers(data)),
      FO.match(() => fallbackColumnMapper(column), FF.identity),
    );

/**
 * Dynamic column conditional mappers.
 */
const dynamicColumnMatchers = (data: unknown[]): ColumnMatcher[] => [
  when(isDateRangeColumn, dateRangeMapper(data)),
  when(isColumnKey('name'), accountNameMapper(data)),
  when(isColumnKey('total'), totalMapper(data)),
];

const dynamicColumnMapper =
  (data: unknown[]) =>
  (column: ReportTableColumn): TableColumn =>
    FF.pipe(
      column,
      firstMatch(dynamicColumnMatchers(data)),
      FO.match(() => fallbackColumnMapper(column), FF.identity),
    );

export const dynamicColumns = (
  columns: ReportTableColumn[],
  data: unknown[],
): TableColumn[] => {
  return FF.pipe(columns, FA.map(dynamicColumnMapper(data)));
};
