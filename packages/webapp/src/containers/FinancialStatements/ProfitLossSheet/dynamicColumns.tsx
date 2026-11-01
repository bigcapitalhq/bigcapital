import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import { isEmpty } from 'lodash';
import type { ProfitLossColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

interface ReportTableColumn {
  key: string;
  label: string;
  cellIndex?: number;
  children?: ReportTableColumn[];
}

interface TableColumn {
  key?: string;
  id?: string;
  Header?: string;
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

type AlignValue = (typeof Align)[keyof typeof Align];

type ColumnMapper = (
  data: unknown[],
) => (column: ReportTableColumn) => TableColumn;

type ColumnMatcher = (column: ReportTableColumn) => FO.Option<TableColumn>;

const getTableCellValueAccessor = (index?: number) => `cells[${index}].value`;

const isColumnKey =
  (key: ProfitLossColumnKey): FF.Predicate<ReportTableColumn> =>
  (column) =>
    column.key === key;

const getReportColWidth = (
  data: unknown[],
  accessor: string,
  labelText?: string,
) => {
  return getColumnWidth(
    data,
    accessor,
    { magicSpacing: 10, minWidth: 100 },
    labelText,
  );
};

const isNodeHasChildren = (node: ReportTableColumn) => !isEmpty(node.children);

/**
 * Shared money column mapper.
 */
const moneyColumnMapper: ColumnMapper = (data) => (column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);
  const width = getReportColWidth(data, accessor, column.label);

  return {
    Header: column.label,
    key: column.key,
    // The column id is sent to the backend as the sorting column key.
    id: column.key,
    accessor,
    width,
    align: Align.Right,
    textOverview: true,
    money: true,
  };
};

/**
 * Date periods money column mapper.
 *
 * The backend does not support sorting date periods columns, and the same
 * column keys are repeated on each date range, so they are not sortable and
 * keep the accessor as their unique id.
 */
const datePeriodColumnMapper: ColumnMapper = (data) => (column) => {
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
 *
 * @param {*} column
 * @param {*} index
 * @returns
 */
const totalColumnsMapper: ColumnMapper = (data) => (column) =>
  FF.pipe(
    column,
    firstMatch(totalColumnMatchers(data)),
    FO.match((): TableColumn => column, FF.identity),
  );

const totalColumnMatchers = (data: unknown[]): ColumnMatcher[] => [
  when(isColumnKey('total'), totalColumn(data)),
  // Percetage of column/row.
  when(isColumnKey('percentage_column'), moneyColumnMapper(data)),
  when(isColumnKey('percentage_row'), moneyColumnMapper(data)),
  when(isColumnKey('percentage_income'), moneyColumnMapper(data)),
  when(isColumnKey('percentage_expenses'), moneyColumnMapper(data)),
  // Previous year.
  when(isColumnKey('previous_year'), moneyColumnMapper(data)),
  when(isColumnKey('previous_year_change'), moneyColumnMapper(data)),
  when(isColumnKey('previous_year_percentage'), moneyColumnMapper(data)),
  // Pervious period.
  when(isColumnKey('previous_period'), moneyColumnMapper(data)),
  when(isColumnKey('previous_period_change'), moneyColumnMapper(data)),
  when(isColumnKey('previous_period_percentage'), moneyColumnMapper(data)),
];

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
const assocColumnsToTotalColumn =
  (data: unknown[], column: ReportTableColumn) =>
  (columnAccessor: TableColumn): TableColumn => {
    const columns = totalColumnsComposer(data, column);

    return {
      ...columnAccessor,
      columns,
    };
  };

/**
 * Retrieves the total column.
 */
const totalColumn: ColumnMapper = (data) => (column) => {
  const hasChildren = isNodeHasChildren(column);
  const accessor = getTableCellValueAccessor(column.cellIndex);
  const width = getReportColWidth(data, accessor, column.label);

  return {
    key: column.key,
    Header: column.label,
    accessor,
    textOverview: true,
    width,
    // Group headers are not sortable, only the leaf total column is.
    disableSortBy: hasChildren,
    align: hasChildren ? Align.Center : Align.Right,
    money: true,
    ...(!hasChildren ? { id: column.key } : {}),
  };
};

/**
 *
 */
const totalColumnCompose: ColumnMapper = (data) => (column) => {
  const hasChildren = isNodeHasChildren(column);
  const base = totalColumn(data)(column);

  return FF.pipe(
    base,
    FO.fromPredicate(FF.constant(hasChildren)),
    FO.map(assocColumnsToTotalColumn(data, column)),
    FO.match(() => base, FF.identity),
  );
};

/**
 * Account name column mapper.
 */
const accountNameColumn: ColumnMapper = (data) => (column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);
  const width = getReportColWidth(data, accessor, column.label);

  return {
    key: column.key,
    // The column id is sent to the backend as the sorting column key.
    id: column.key,
    Header: column.label,
    accessor,
    className: column.key,
    textOverview: true,
    width: Math.max(width, 300),
    sticky: Align.Left,
  };
};

/**
 *
 * @param {*} data
 * @param {*} column
 * @returns
 */
const dateRangeSoloColumnAttrs = (
  data: unknown[],
  column: ReportTableColumn,
) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);

  return {
    accessor,
    width: getReportColWidth(data, accessor),
  };
};

/**
 * Date range children columns composer.
 */
const dateRangeColumnsComposer = (
  data: unknown[],
  column: ReportTableColumn,
): TableColumn[] => {
  return FF.pipe(column.children ?? [], FA.map(datePeriodColumnMapper(data)));
};

/**
 * Assoc the date range children columns.
 */
const assocColumnsToDateRange =
  (data: unknown[], column: ReportTableColumn) =>
  (columnAccessor: TableColumn): TableColumn => ({
    ...columnAccessor,
    columns: dateRangeColumnsComposer(data, column),
  });

/**
 * Retrieves date range column.
 */
const dateRangeColumn: ColumnMapper = (data) => (column) => {
  const isDateColumnHasColumns = isNodeHasChildren(column);

  const columnAccessor: TableColumn = {
    Header: column.label,
    key: column.key,
    // Date periods columns are not supported by the backend sorting.
    disableSortBy: true,
    textOverview: true,
    align: isDateColumnHasColumns ? Align.Center : Align.Right,
    money: true,
  };

  return FF.pipe(
    columnAccessor,
    FO.fromPredicate(FF.constant(isDateColumnHasColumns)),
    FO.map(assocColumnsToDateRange(data, column)),
    FO.alt(
      (): FO.Option<TableColumn> =>
        FF.pipe(
          columnAccessor,
          FO.fromPredicate(FF.constant(!isDateColumnHasColumns)),
          FO.map((columnAttrs) => ({
            ...columnAttrs,
            ...dateRangeSoloColumnAttrs(data, column),
          })),
        ),
    ),
    FO.match(() => columnAccessor, FF.identity),
  );
};

/**
 * Detarmines the given string starts with `date-range` string.
 */
const isMatchesDateRange = (r: string) => /^date-range/.test(r);

const isDateRangeColumn: FF.Predicate<ReportTableColumn> = (column) =>
  isMatchesDateRange(column.key);

/**
 *
 * @param {} data
 * @param {} column
 */
const dynamicColumnMatchers = (data: unknown[]): ColumnMatcher[] => [
  when(isDateRangeColumn, dateRangeColumn(data)),
  when(isColumnKey('name'), accountNameColumn(data)),
  when(isColumnKey('total'), totalColumnCompose(data)),
];

const dynamicColumnMapper =
  (data: unknown[]) =>
  (column: ReportTableColumn): TableColumn =>
    FF.pipe(
      column,
      firstMatch(dynamicColumnMatchers(data)),
      FO.match((): TableColumn => column, FF.identity),
    );

export const dynamicColumns = (
  columns: ReportTableColumn[],
  data: unknown[],
) => {
  return FF.pipe(columns, FA.map(dynamicColumnMapper(data)));
};
