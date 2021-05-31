import * as R from 'ramda';
import { CellTextSpan } from 'components/Datatable/Cells';
import { getColumnWidth } from 'utils';
import { formatMessage } from 'services/intl';

/**
 * Account name column mapper.
 */
const accountNameMapper = (column) => ({
  id: column.key,
  key: column.key,
  Header: formatMessage({ id: 'account_name' }),
  accessor: 'cells[0].value',
  className: 'account_name',
  textOverview: true,
  width: 240,
  disableSortBy: true,
});

/**
 * Date range columns mapper.
 */
const dateRangeMapper = (data, index, column) => ({
  id: column.key,
  Header: column.label,
  key: column.key,
  accessor: `cells[${index}].value`,
  width: getColumnWidth(data, `cells.${index}.value`, { minWidth: 100 }),
  className: `date-period ${column.key}`,
  disableSortBy: true,
});

/**
 * Total column mapper.
 */
const totalMapper = (data, index, column) => ({
  key: 'total',
  Header: formatMessage({ id: 'total' }),
  accessor: `cells[${index}].value`,
  className: 'total',
  textOverview: true,
  Cell: CellTextSpan,
  width: getColumnWidth(data, `cells[${index}].value`, { minWidth: 100  }),
  disableSortBy: true,
});


/**
 * Detarmines the given string starts with `date-range` string.
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
