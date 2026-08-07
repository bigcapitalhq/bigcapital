import * as R from 'ramda';
import intl from 'react-intl-universal';
import { CellTextSpan } from '@/components/Datatable/Cells';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';

interface ReportTableColumn {
  key: string;
  label: string;
  cellIndex?: number;
  children?: ReportTableColumn[];
}

const accountNameMapper = (column: ReportTableColumn) => ({
  id: column.key,
  key: column.key,
  Header: intl.get('account_name'),
  accessor: 'cells[0].value',
  className: 'account_name',
  textOverview: true,
  width: 400,
  disableSortBy: true,
  sticky: Align.Left,
});

const dateRangeMapper = (
  data: unknown[],
  index: number,
  column: ReportTableColumn,
) => ({
  id: column.key,
  Header: column.label,
  key: column.key,
  accessor: `cells[${index}].value`,
  width: getColumnWidth(data, `cells.${index}.value`, {
    magicSpacing: 12,
    minWidth: 100,
  }),
  className: `date-period ${column.key}`,
  disableSortBy: true,
  textOverview: true,
  align: Align.Right,
  money: true,
});

const totalMapper = (
  data: unknown[],
  index: number,
  column: ReportTableColumn,
) => ({
  key: 'total',
  Header: intl.get('total'),
  accessor: `cells[${index}].value`,
  className: 'total',
  textOverview: true,
  Cell: CellTextSpan,
  width: getColumnWidth(data, `cells[${index}].value`, {
    magicSpacing: 12,
    minWidth: 100,
  }),
  disableSortBy: true,
  align: Align.Right,
  money: true,
});

const isMatchesDateRange = (r: string) => R.match(/^date-range/g, r).length > 0;

export const dynamicColumns = (
  columns: ReportTableColumn[],
  data: unknown[],
) => {
  const mapper = (column, index) => {
    return R.compose(
      R.when(
        R.pathSatisfies(isMatchesDateRange, ['key']),
        R.curry(dateRangeMapper)(data, index),
      ),
      R.when(R.pathEq(['key'], 'name'), accountNameMapper),
      R.when(R.pathEq(['key'], 'total'), R.curry(totalMapper)(data, index)),
    )(column);
  };
  return columns.map(mapper);
};
