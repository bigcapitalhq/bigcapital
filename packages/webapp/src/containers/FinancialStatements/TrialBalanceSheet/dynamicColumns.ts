// @ts-nocheck
import * as R from 'ramda';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';

const ACCOUNT_NAME_COLUMN_WIDTH = 320;
const AMOUNT_COLUMNS_MIN_WIDTH = 120;
const AMOUNT_COLUMNS_MAGIC_SPACING = 10;

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const accountNameAccessor = R.curry((data, column) => {
  const accessor = getTableCellValueAccessor(column.cell_index);

  return {
    Header: column.label,
    id: column.key,
    accessor,
    className: column.key,
    width: ACCOUNT_NAME_COLUMN_WIDTH,
  };
});

const amountAccessor = R.curry((data, column) => {
  const accessor = getTableCellValueAccessor(column.cell_index);

  return {
    Header: column.label,
    id: column.key,
    accessor,
    className: column.key,
    width: getColumnWidth(data, accessor, {
      magicSpacing: AMOUNT_COLUMNS_MAGIC_SPACING,
      minWidth: AMOUNT_COLUMNS_MIN_WIDTH,
    }),
    align: Align.Right,
    money: true,
  };
});

const dynamicColumnMapper = R.curry((data, column) => {
  const accountNameColumn = accountNameAccessor(data);
  const creditColumn = amountAccessor(data);
  const debitColumn = amountAccessor(data);
  const totalColumn = amountAccessor(data);

  return R.compose(
    R.when(R.pathEq(['key'], 'account'), accountNameColumn),
    R.when(R.pathEq(['key'], 'credit'), creditColumn),
    R.when(R.pathEq(['key'], 'debit'), debitColumn),
    R.when(R.pathEq(['key'], 'total'), totalColumn),
  )(column);
});

export const trialBalancesheetDynamicColumns = (columns, data) => {
  return R.map(dynamicColumnMapper(data), columns);
};
