import * as R from 'ramda';

import { getColumnWidth } from '@/utils';
import { Align } from '@/constants';
import { flow } from 'fp-ts/function';

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const taxNameAccessor = R.curry((data: any[], column: Record<string, any>) => ({
  key: column.key,
  Header: column.label,
  accessor: getTableCellValueAccessor(column.cellIndex),
  sticky: 'left',
  width: 300,
  textOverview: true,
  disableSortBy: true,
}));

const taxableAmountAccessor = R.curry(
  (data: any[], column: Record<string, any>) => {
    const accessor = getTableCellValueAccessor(column.cellIndex);

    return {
      Header: column.label,
      id: column.key,
      accessor: getTableCellValueAccessor(column.cellIndex),
      className: column.key,
      width: getColumnWidth(data, accessor, { minWidth: 120 }),
      align: Align.Right,
      disableSortBy: true,
    };
  },
);

const dynamicColumnMapper = R.curry(
  (data: any[], column: Record<string, any>) => {
    const taxNameAccessorColumn = taxNameAccessor(data);
    const taxableAmountColumn = taxableAmountAccessor(data);

    return flow(
      R.when(R.pathEq(['key'], 'collectedTax'), taxableAmountColumn),
      R.when(R.pathEq(['key'], 'taxPercentage'), taxableAmountColumn),
      R.when(R.pathEq(['key'], 'taxRate'), taxableAmountColumn),
      R.when(R.pathEq(['key'], 'taxableAmount'), taxableAmountColumn),
      R.when(R.pathEq(['key'], 'taxName'), taxNameAccessorColumn),
    )(column);
  },
);

export const salesTaxLiabilitySummaryDynamicColumns = (
  columns: Record<string, any>[],
  data: any[],
) => {
  return R.map(dynamicColumnMapper(data), columns);
};
