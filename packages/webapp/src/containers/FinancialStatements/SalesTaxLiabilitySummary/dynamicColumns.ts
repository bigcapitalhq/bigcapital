// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { getColumnWidth } from '@/utils';
import { Align } from '@/constants';

const getTableCellValueAccessor = (index) => `cells[${index}].value`;

const taxNameAccessor = R.curry((data, column) => ({
  key: column.key,
  Header: column.label,
  accessor: getTableCellValueAccessor(column.cell_index),
  sticky: 'left',
  width: 300,
  textOverview: true,
  disableSortBy: true,
}));

const taxableAmountAccessor = R.curry((data, column) => {
  const accessor = getTableCellValueAccessor(column.cell_index);

  return {
    Header: column.label,
    id: column.key,
    accessor: getTableCellValueAccessor(column.cell_index),
    className: column.key,
    width: getColumnWidth(data, accessor, { minWidth: 120 }),
    align: Align.Right,
    disableSortBy: true,
  };
});

const dynamicColumnMapper = R.curry((data, column) => {
  const taxNameAccessorColumn = taxNameAccessor(data);
  const taxableAmountColumn = taxableAmountAccessor(data);

  return R.compose(
    R.when(R.pathEq(['key'], 'taxName'), taxNameAccessorColumn),
    R.when(R.pathEq(['key'], 'taxableAmount'), taxableAmountColumn),
    R.when(R.pathEq(['key'], 'taxRate'), taxableAmountColumn),
    R.when(R.pathEq(['key'], 'taxPercentage'), taxableAmountColumn),
    R.when(R.pathEq(['key'], 'collectedTax'), taxableAmountColumn),
  )(column);
});

export const salesTaxLiabilitySummaryDynamicColumns = (columns, data) => {
  return R.map(dynamicColumnMapper(data), columns);
};
