import { isEmpty } from 'lodash';
import * as R from 'ramda';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';

interface ReportTableColumn {
  key: string;
  label: string;
  cellIndex: number;
  children?: ReportTableColumn[];
}

interface TableColumn {
  key: string;
  Header: string;
  accessor?: string;
  className?: string;
  textOverview?: boolean;
  width?: number;
  sticky?: Align;
  align?: Align;
  disableSortBy?: boolean;
  money?: boolean;
  columns?: TableColumn[];
}

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

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
const accountNameMapper = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
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
  },
);

/**
 * Detarmines whether the given column has children columns.
 * @returns {boolean}
 */
const isColumnHasColumns = (column: ReportTableColumn): boolean =>
  !isEmpty(column.children);

/**
 *
 * @param {*} data
 * @param {*} column
 * @returns
 */
const dateRangeSoloColumnAttrs = (
  data: unknown[],
  column: ReportTableColumn,
): Partial<TableColumn> => {
  const accessor = getTableCellValueAccessor(column.cellIndex);

  return {
    accessor,
    width: getReportColWidth(data, accessor),
  };
};

/**
 * Total column mapper.
 */
const totalMapper = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
    const hasChildren = !isEmpty(column.children);
    const accessor = getTableCellValueAccessor(column.cellIndex);
    const width = getReportColWidth(data, accessor, column.label);

    const columnAccessor: TableColumn = {
      key: column.key,
      Header: column.label,
      accessor,
      textOverview: true,
      width,
      disableSortBy: true,
      money: true,
      align: hasChildren ? Align.Center : Align.Right,
    };
    return R.compose(
      R.when(R.always(hasChildren), assocColumnsToTotalColumn(data, column)),
    )(columnAccessor);
  },
);

/**
 * `Percentage of column` column accessor.
 */
const percentageOfColumnAccessor = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
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
  },
);

/**
 * `Percentage of row` column accessor.
 */
const percentageOfRowAccessor = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
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
  },
);

/**
 * Previous year column accessor.
 */
const previousYearAccessor = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
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
  },
);

/**
 * Pervious year change column accessor.
 */
const previousYearChangeAccessor = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
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
  },
);

/**
 * Previous year percentage column accessor.
 */
const previousYearPercentageAccessor = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
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
  },
);

/**
 * Previous period column accessor.
 */
const previousPeriodAccessor = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
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
  },
);

/**
 * Previous period change column accessor.
 */
const previousPeriodChangeAccessor = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
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
  },
);

/**
 * Previous period percentage column accessor.
 */
const previousPeriodPercentageAccessor = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
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
  },
);

/**
 *
 * @param {*} column
 * @param {*} index
 * @returns
 */
const totalColumnsMapper = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
    return R.compose(
      R.when(R.pathEq(['key'], 'total'), totalMapper(data)),
      // Percetage of column/row.
      R.when(
        R.pathEq(['key'], 'percentageOfColumn'),
        percentageOfColumnAccessor(data),
      ),
      R.when(
        R.pathEq(['key'], 'percentageOfRow'),
        percentageOfRowAccessor(data),
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
  },
);

/**
 * Total sub-columns composer.
 */
const totalColumnsComposer = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn[] => {
    return R.map(totalColumnsMapper(data), column.children ?? []);
  },
);

/**
 * Assoc columns to total column.
 */
const assocColumnsToTotalColumn = R.curry(
  (
    data: unknown[],
    column: ReportTableColumn,
    columnAccessor: TableColumn,
  ): TableColumn => {
    const columns = totalColumnsComposer(data, column);
    return R.assoc('columns', columns, columnAccessor);
  },
);

/**
 * Date range columns mapper.
 */
const dateRangeMapper = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
    const isDateColumnHasColumns = isColumnHasColumns(column);

    const columnAccessor: TableColumn = {
      Header: column.label,
      key: column.key,
      disableSortBy: true,
      textOverview: true,
      money: true,
      align: isDateColumnHasColumns ? Align.Center : Align.Right,
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
  },
);

/**
 * Detarmines the given string starts with `date-range` string.
 */
const isMatchesDateRange = (r: string): boolean =>
  R.match(/^date-range/g, r).length > 0;

/**
 * Dynamic column mapper.
 */
const dynamicColumnMapper = R.curry(
  (data: unknown[], column: ReportTableColumn): TableColumn => {
    const indexTotalMapper = totalMapper(data);
    const indexAccountNameMapper = accountNameMapper(data);
    const indexDatePeriodMapper = dateRangeMapper(data);

    return R.compose(
      R.when(
        R.pathSatisfies(isMatchesDateRange, ['key']),
        indexDatePeriodMapper,
      ),
      R.when(R.pathEq(['key'], 'name'), indexAccountNameMapper),
      R.when(R.pathEq(['key'], 'total'), indexTotalMapper),
    )(column);
  },
);

export const dynamicColumns = (
  columns: ReportTableColumn[],
  data: unknown[],
): TableColumn[] => {
  return R.map(dynamicColumnMapper(data), columns);
};
