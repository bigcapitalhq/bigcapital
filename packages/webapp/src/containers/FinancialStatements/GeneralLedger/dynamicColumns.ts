// @ts-nocheck
import { getColumnWidth } from '@/utils';
import * as R from 'ramda';
import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import { Align } from '@/constants';

const getTableCellValueAccessor = (index) => `cells[${index}].value`;

const getReportColWidth = (data, accessor, headerText) => {
  return getColumnWidth(
    data,
    accessor,
    { magicSpacing: 10, minWidth: 100 },
    headerText,
  );
};

/**
 * Account name column mapper.
 */
const commonColumnMapper = R.curry((data, column) => {
  const accessor = getTableCellValueAccessor(column.cell_index);

  return {
    key: column.key,
    Header: column.label,
    accessor,
    className: column.key,
    textOverview: true,
  };
});

/**
 * Numeric columns accessor.
 */
const numericColumnAccessor = R.curry((data, column) => {
  const accessor = getTableCellValueAccessor(column.cell_index);
  const width = getReportColWidth(data, accessor, column.label);

  return {
    ...column,
    align: Align.Right,
    width,
  };
});

/**
 * Date column accessor.
 */
const dateColumnAccessor = R.curry((column) => {
  return {
    ...column,
    width: 120,
  };
});

/**
 * Transaction type column accessor.
 */
const transactionTypeColumnAccessor = (column) => {
  return {
    ...column,
    width: 125,
  };
};

/**
 * Transaction number column accessor.
 */
const transactionIdColumnAccessor = (column) => {
  return {
    ...column,
    width: 80,
  };
};

const dynamiColumnMapper = R.curry((data, column) => {
  const _numericColumnAccessor = numericColumnAccessor(data);

  return R.compose(
    R.when(R.pathEq(['key'], 'date'), dateColumnAccessor),
    R.when(
      R.pathEq(['key'], 'reference_type'),
      transactionTypeColumnAccessor,
    ),
    R.when(
      R.pathEq(['key'], 'reference_number'),
      transactionIdColumnAccessor,
    ),
    R.when(R.pathEq(['key'], 'credit'), _numericColumnAccessor),
    R.when(R.pathEq(['key'], 'debit'), _numericColumnAccessor),
    R.when(R.pathEq(['key'], 'amount'), _numericColumnAccessor),
    R.when(R.pathEq(['key'], 'running_balance'), _numericColumnAccessor),
    commonColumnMapper(data),
  )(column);
});

/**
 * Composes the dynamic columns that fetched from request to columns to table component.
 */
export const dynamicColumns = R.curry((data, columns) => {
  return R.map(dynamiColumnMapper(data), columns);
});

/**
 * Retrieves the G/L sheet table columns for table component.
 */
export const useGeneralLedgerTableColumns = () => {
  const { generalLedger } = useGeneralLedgerContext();

  if (!generalLedger) {
    throw new Error('asdfadsf');
  }
  const { table } = generalLedger;

  return dynamicColumns(table.rows, table.columns);
};
