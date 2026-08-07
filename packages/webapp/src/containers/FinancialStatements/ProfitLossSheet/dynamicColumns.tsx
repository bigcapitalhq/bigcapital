import { isEmpty } from 'lodash';
import * as R from 'ramda';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';

interface ReportTableColumn {
  key: string;
  label: string;
  cellIndex?: number;
  children?: ReportTableColumn[];
}

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

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
const percentageOfIncomeAccessor = R.curry((data, column) => {
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
});

/**
 * `Percentage of expense` column accessor.
 */
const percentageOfExpenseAccessor = R.curry((data, column) => {
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
});

/**
 * `Percentage of column` column accessor.
 */
const percentageOfColumnAccessor = R.curry((data, column) => {
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
});

/**
 * `Percentage of row` column accessor.
 */
const percentageOfRowAccessor = R.curry((data, column) => {
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
});

/**
 * Previous year column accessor.
 */
const previousYearAccessor = R.curry((data, column) => {
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
});

/**
 * Pervious year change column accessor.
 */
const previousYearChangeAccessor = R.curry((data, column) => {
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
});

/**
 * Previous year percentage column accessor.
 */
const previousYearPercentageAccessor = R.curry((data, column) => {
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
});

/**
 * Previous period column accessor.
 */
const previousPeriodAccessor = R.curry((data, column) => {
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
});

/**
 * Previous period change column accessor.
 */
const previousPeriodChangeAccessor = R.curry((data, column) => {
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
});

/**
 * Previous period percentage column accessor.
 */
const previousPeriodPercentageAccessor = R.curry((data, column) => {
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
});

/**
 *
 * @param {*} column
 * @param {*} index
 * @returns
 */
const totalColumnsMapper = R.curry((data, column) => {
  return R.compose(
    R.when(R.pathEq(['key'], 'total'), totalColumn(data)),
    // Percetage of column/row.
    R.when(
      R.pathEq(['key'], 'percentageColumn'),
      percentageOfColumnAccessor(data),
    ),
    R.when(R.pathEq(['key'], 'percentageRow'), percentageOfRowAccessor(data)),
    R.when(
      R.pathEq(['key'], 'percentageIncome'),
      percentageOfIncomeAccessor(data),
    ),
    R.when(
      R.pathEq(['key'], 'percentageExpenses'),
      percentageOfExpenseAccessor(data),
    ),
    // Previous year.
    R.when(R.pathEq(['key'], 'previousYear'), previousYearAccessor(data)),
    R.when(
      R.pathEq(['key'], 'previousYearChange'),
      previousYearChangeAccessor(data),
    ),
    R.when(
      R.pathEq(['key'], 'previousYearPercentage'),
      previousYearPercentageAccessor(data),
    ),
    // Pervious period.
    R.when(R.pathEq(['key'], 'previousPeriod'), previousPeriodAccessor(data)),
    R.when(
      R.pathEq(['key'], 'previousPeriodChange'),
      previousPeriodChangeAccessor(data),
    ),
    R.when(
      R.pathEq(['key'], 'previousPeriodPercentage'),
      previousPeriodPercentageAccessor(data),
    ),
  )(column);
});

/**
 * Total sub-columns composer.
 */
const totalColumnsComposer = R.curry((data, column) => {
  return R.map(totalColumnsMapper(data), column.children);
});

/**
 * Assoc columns to total column.
 */
const assocColumnsToTotalColumn = R.curry((data, column, columnAccessor) => {
  const columns = totalColumnsComposer(data, column);

  return R.assoc('columns', columns, columnAccessor);
});

/**
 * Retrieves the total column.
 */
const totalColumn = R.curry((data, column) => {
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
});

/**
 *
 */
const totalColumnCompose = R.curry((data, column) => {
  const hasChildren = isNodeHasChildren(column);

  return R.compose(
    R.when(R.always(hasChildren), assocColumnsToTotalColumn(data, column)),
    totalColumn(data),
  )(column);
});

/**
 * Account name column mapper.
 */
const accountNameColumn = R.curry((data, column) => {
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
});

/**
 *
 * @param {*} data
 * @param {*} column
 * @returns
 */
const dateRangeSoloColumnAttrs = (data, column) => {
  const accessor = getTableCellValueAccessor(column.cellIndex);

  return {
    accessor,
    width: getReportColWidth(data, accessor),
  };
};

/**
 * Retrieves date range column.
 */
const dateRangeColumn = R.curry((data, column) => {
  const isDateColumnHasColumns = isNodeHasChildren(column);

  const columnAccessor = {
    Header: column.label,
    key: column.key,
    disableSortBy: true,
    textOverview: true,
    align: isDateColumnHasColumns ? Align.Center : Align.Right,
    money: true,
  };
  return R.compose(
    R.when(
      R.always(isDateColumnHasColumns),
      assocColumnsToTotalColumn(data, column),
    ),
    R.when(
      R.always(!isDateColumnHasColumns),
      R.mergeLeft(dateRangeSoloColumnAttrs(data, column)),
    ),
  )(columnAccessor);
});

/**
 * Detarmines the given string starts with `date-range` string.
 */
const isMatchesDateRange = (r: string) => R.match(/^date-range/g, r).length > 0;

/**
 *
 * @param {} data
 * @param {} column
 */
const dynamicColumnMapper = R.curry((data, column) => {
  const indexTotalColumn = totalColumnCompose(data);
  const indexAccountNameColumn = accountNameColumn(data);
  const indexDatePeriodMapper = dateRangeColumn(data);

  return R.compose(
    R.when(R.pathSatisfies(isMatchesDateRange, ['key']), indexDatePeriodMapper),
    R.when(R.pathEq(['key'], 'name'), indexAccountNameColumn),
    R.when(R.pathEq(['key'], 'total'), indexTotalColumn),
  )(column);
});

export const dynamicColumns = (
  columns: ReportTableColumn[],
  data: unknown[],
) => {
  return R.map(dynamicColumnMapper(data), columns);
};
