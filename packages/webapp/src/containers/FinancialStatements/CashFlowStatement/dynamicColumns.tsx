// @ts-nocheck
import * as R from 'ramda';
import intl from 'react-intl-universal';

import { Align } from '@/constants';
import { CellTextSpan } from '@/components/Datatable/Cells';
import { getColumnWidth } from '@/utils';

/**
 * Account name column mapper.
 */
const accountNameMapper = (column) => ({
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

/**
 * Date range columns mapper.
 */
const dateRangeMapper = (data, index, column) => ({
  id: column.key,
  Header: column.label,
  key: column.key,
  accessor: `cells[${index}].value`,
  width: getColumnWidth(data, `cells.${index}.value`, {
    magicSpacing: 10,
    minWidth: 100,
  }),
  className: `date-period ${column.key}`,
  disableSortBy: true,
  textOverview: true,
  align: Align.Right,
});

/**
 * Total column mapper.
 */
const totalMapper = (data, index, column) => ({
  key: 'total',
  Header: intl.get('total'),
  accessor: `cells[${index}].value`,
  className: 'total',
  textOverview: true,
  Cell: CellTextSpan,
  width: getColumnWidth(data, `cells[${index}].value`, {
    magicSpacing: 10,
    minWidth: 100,
  }),
  disableSortBy: true,
  align: Align.Right,
});

/**
 * Determines the given string starts with `date-range` string.
 */
const isMatchesDateRange = (r) => R.match(/^date-range/g, r).length > 0;

/**
 * Cash flow dynamic columns.
 */
export const dynamicColumns = (columns, data) => {
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
