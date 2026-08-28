import * as R from 'ramda';
import type { SalesTaxLiabilityColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';

const isColumnKey = (key: SalesTaxLiabilityColumnKey) => R.pathEq(['key'], key);

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

    return R.compose(
      R.when(isColumnKey('taxName'), taxNameAccessorColumn),
      R.when(isColumnKey('taxableAmount'), taxableAmountColumn),
      R.when(isColumnKey('taxRate'), taxableAmountColumn),
      R.when(isColumnKey('taxPercentage'), taxableAmountColumn),
      R.when(isColumnKey('collectedTax'), taxableAmountColumn),
    )(column);
  },
);

export const salesTaxLiabilitySummaryDynamicColumns = (
  columns: Record<string, any>[],
  data: any[],
) => {
  return R.map(dynamicColumnMapper(data), columns);
};
