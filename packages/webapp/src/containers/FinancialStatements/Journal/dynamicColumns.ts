// @ts-nocheck
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import * as R from 'ramda';
import { useJournalSheetContext } from './JournalProvider';

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
 * Common column mapper.
 */
const commonAccessor = R.curry((data, column) => {
  const accessor = getTableCellValueAccessor(column.cell_index);

  return {
    key: column.key,
    Header: column.label,
    accessor,
    className: column.key,
    textOverview: true,
    align: Align.Left,
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
    money: true,
    width,
  };
});

/**
 * Date column accessor.
 */
const dateColumnAccessor = (column) => {
  return {
    ...column,
    width: 100,
  };
};

/**
 * Transaction type column accessor.
 */
const transactionTypeColumnAccessor = (column) => {
  return {
    ...column,
    width: 120,
  };
};

/**
 * Transaction number column accessor.
 */
const transactionNumberColumnAccessor = (column) => {
  return {
    ...column,
    width: 70,
  };
};

/**
 * Account code column accessor.
 */
const accountCodeColumnAccessor = (column) => {
  return {
    ...column,
    width: 70,
  };
};

/**
 * Dynamic column mapper.
 * @param {} data -
 * @param {} column -
 */
const dynamicColumnMapper = R.curry((data, column) => {
  const _commonAccessor = commonAccessor(data);
  const _numericColumnAccessor = numericColumnAccessor(data);

  return R.compose(
    R.when(R.pathEq(['key'], 'date'), dateColumnAccessor),
    R.when(
      R.pathEq(['key'], 'transaction_type'),
      transactionTypeColumnAccessor,
    ),
    R.when(
      R.pathEq(['key'], 'transaction_number'),
      transactionNumberColumnAccessor,
    ),
    R.when(R.pathEq(['key'], 'account_code'), accountCodeColumnAccessor),
    R.when(R.pathEq(['key'], 'credit'), _numericColumnAccessor),
    R.when(R.pathEq(['key'], 'debit'), _numericColumnAccessor),
    _commonAccessor,
  )(column);
});

/**
 * Composes the fetched dynamic columns from the server to the columns to pass it 
 * to the table component.
 */
export const dynamicColumns = (columns, data) => {
  return R.map(dynamicColumnMapper(data), columns);
};

/**
 * Retrieves the table columns of journal sheet.
 */
export const useJournalSheetColumns = () => {
  const { journalSheet } = useJournalSheetContext();

  if (!journalSheet) {
    throw new Error('The journal sheet is not loaded');
  }
  const { table } = journalSheet;

  return dynamicColumns(table.columns, table.rows);
};
