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
 * `Percentage of income` column accessor.
 */
const percentageOfIncomeAccessor: ColumnMapper = (data) => (column) => {
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
 * `Percentage of expense` column accessor.
 */
const percentageOfExpenseAccessor: ColumnMapper = (data) => (column) => {
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
 * `Percentage of column` column accessor.
 */
const percentageOfColumnAccessor: ColumnMapper = (data) => (column) => {
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
 * `Percentage of row` column accessor.
 */
const percentageOfRowAccessor: ColumnMapper = (data) => (column) => {
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
 * Previous year column accessor.
 */
const previousYearAccessor: ColumnMapper = (data) => (column) => {
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
 * Pervious year change column accessor.
 */
const previousYearChangeAccessor: ColumnMapper = (data) => (column) => {
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
 * Previous year percentage column accessor.
 */
const previousYearPercentageAccessor: ColumnMapper = (data) => (column) => {
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
 * Previous period column accessor.
 */
const previousPeriodAccessor: ColumnMapper = (data) => (column) => {
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
 * Previous period change column accessor.
 */
const previousPeriodChangeAccessor: ColumnMapper = (data) => (column) => {
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
 * Previous period percentage column accessor.
 */
const previousPeriodPercentageAccessor: ColumnMapper = (data) => (column) => {
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
  when(isColumnKey('percentage_column'), percentageOfColumnAccessor(data)),
  when(isColumnKey('percentage_row'), percentageOfRowAccessor(data)),
  when(isColumnKey('percentage_income'), percentageOfIncomeAccessor(data)),
  when(isColumnKey('percentage_expenses'), percentageOfExpenseAccessor(data)),
  // Previous year.
  when(isColumnKey('previous_year'), previousYearAccessor(data)),
  when(isColumnKey('previous_year_change'), previousYearChangeAccessor(data)),
  when(
    isColumnKey('previous_year_percentage'),
    previousYearPercentageAccessor(data),
  ),
  // Pervious period.
  when(isColumnKey('previous_period'), previousPeriodAccessor(data)),
  when(
    isColumnKey('previous_period_change'),
    previousPeriodChangeAccessor(data),
  ),
  when(
    isColumnKey('previous_period_percentage'),
    previousPeriodPercentageAccessor(data),
  ),
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
    disableSortBy: true,
    align: hasChildren ? Align.Center : Align.Right,
    money: true,
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
 * Retrieves date range column.
 */
const dateRangeColumn: ColumnMapper = (data) => (column) => {
  const isDateColumnHasColumns = isNodeHasChildren(column);

  const columnAccessor: TableColumn = {
    Header: column.label,
    key: column.key,
    disableSortBy: true,
    textOverview: true,
    align: isDateColumnHasColumns ? Align.Center : Align.Right,
    money: true,
  };

  return FF.pipe(
    columnAccessor,
    FO.fromPredicate(FF.constant(isDateColumnHasColumns)),
    FO.map(assocColumnsToTotalColumn(data, column)),
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
