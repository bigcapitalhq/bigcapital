import * as Yup from 'yup';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import moment from 'moment';
import { CellTextSpan } from 'components/Datatable/Cells';
import { getColumnWidth } from 'utils';

export const getBalanceSheetHeaderDefaultValues = () => {
  return {
    basic: 'cash',
    filterByOption: 'without-zero-balance',
    displayColumnsType: 'total',
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
  };
};

export const getBalanceSheetHeaderValidationSchema = () =>
  Yup.object().shape({
    dateRange: Yup.string().optional(),
    fromDate: Yup.date().required().label(intl.get('fromDate')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('toDate')),
    filterByOption: Yup.string(),
    displayColumnsType: Yup.string(),
  });

/**
 * Account name column mapper.
 */
const accountNameMapper = (data, index, column) => {
  return {
    id: column.key,
    key: column.key,
    Header: column.label,
    accessor: `cells[${index}].value`,
    className: column.key,
    textOverview: true,
    Cell: CellTextSpan,
    width: getColumnWidth(data, `cells[${index}].value`, {
      magicSpacing: 10,
      minWidth: 240,
    }),
  };
};

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
});

/**
 * Total column mapper.
 */
const totalMapper = (data, index, column) => {
  return {
    id: column.key,
    key: column.key,
    Header: column.label,
    accessor: `cells[${index}].value`,
    className: 'total',
    textOverview: true,
    Cell: CellTextSpan,
    width: getColumnWidth(data, `cells[${index}].value`, {
      magicSpacing: 10,
      minWidth: 200,
    }),
    disableSortBy: true,
  };
};

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
      R.when(
        R.pathEq(['key'], 'name'),
        R.curry(accountNameMapper)(data, index),
      ),
      R.when(R.pathEq(['key'], 'total'), R.curry(totalMapper)(data, index)),
    )(column);
  };
  return columns.map(mapper);
};
