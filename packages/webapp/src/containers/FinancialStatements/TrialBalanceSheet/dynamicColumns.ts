import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import * as R from 'ramda';

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const accountNameAccessor = R.curry((data, column) => {
  const accessor = getTableCellValueAccessor(column.cell_index);

  return {
    Header: column.label,
    id: column.key,
    accessor,
    className: column.key,
    width: getColumnWidth(data, accessor, { minWidth: 120 }),
  };
});

const amountAccessor = R.curry((data, column) => {
  const accessor = getTableCellValueAccessor(column.cell_index);

  return {
    Header: column.label,
    id: column.key,
    accessor,
    className: column.key,
    width: getColumnWidth(data, accessor, { minWidth: 120 }),
    align: Align.Right,
  };
});

const dynamicColumnMapper = R.curry((data, column) => {
  const accountNameColumn = accountNameAccessor(data);
  const creditColumn = amountAccessor(data);
  const debitColumn = amountAccessor(data);
  const totalColumn = amountAccessor(data);

  return R.compose(
    R.when(R.pathEq(['key'], 'account_name'), accountNameColumn),
    R.when(R.pathEq(['key'], 'credit'), creditColumn),
    R.when(R.pathEq(['key'], 'debit'), debitColumn),
    R.when(R.pathEq(['key'], 'total'), totalColumn),
  )(column);
});

export const trialBalancesheetDynamicColumns = (columns, data) => {
  return R.map(dynamicColumnMapper(data), columns);
};
