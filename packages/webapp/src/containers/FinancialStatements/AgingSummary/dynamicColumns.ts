// @ts-nocheck
import React, { useMemo } from 'react';
import * as R from 'ramda';
import { getColumnWidth } from '@/utils';
import { Align } from '@/constants';

const getTableCellValueAccessor = (index) => `cells[${index}].value`;

const contactNameAccessor = R.curry((data, column) => ({
  key: column.key,
  Header: column.label,
  accessor: getTableCellValueAccessor(column.cell_index),
  sticky: 'left',
  width: 240,
  textOverview: true,
}));

const currentAccessor = R.curry((data, column) => {
  const accessor = getTableCellValueAccessor(column.cell_index);

  return {
    key: column.key,
    Header: column.label,
    accessor,
    className: column.id,
    width: getColumnWidth(data, accessor, { minWidth: 120 }),
    align: Align.Right,
  };
});

const totalAccessor = R.curry((data, column) => {
  const accessor = getTableCellValueAccessor(column.cell_index);

  return {
    Header: column.label,
    id: column.key,
    accessor: getTableCellValueAccessor(column.cell_index),
    className: column.key,
    width: getColumnWidth(data, accessor, { minWidth: 120 }),
    align: Align.Right,
  };
});

const agingPeriodAccessor = R.curry((data, column) => {
  const accessor = getTableCellValueAccessor(column.cell_index);

  return {
    Header: column.label,
    id: `${column.key}-${column.cell_index}`,
    accessor,
    className: column.key,
    width: getColumnWidth(data, accessor, { minWidth: 120 }),
    align: Align.Right,
  };
});

const dynamicColumnMapper = R.curry((data, column) => {
  const totalAccessorColumn = totalAccessor(data);
  const currentAccessorColumn = currentAccessor(data);
  const customerNameAccessorColumn = contactNameAccessor(data);
  const agingPeriodAccessorColumn = agingPeriodAccessor(data);

  return R.compose(
    R.when(R.pathEq(['key'], 'total'), totalAccessorColumn),
    R.when(R.pathEq(['key'], 'current'), currentAccessorColumn),
    R.when(R.pathEq(['key'], 'customer_name'), customerNameAccessorColumn),
    R.when(R.pathEq(['key'], 'vendor_name'), customerNameAccessorColumn),
    R.when(R.pathEq(['key'], 'aging_period'), agingPeriodAccessorColumn),
  )(column);
});

export const agingSummaryDynamicColumns = (columns, data) => {
  return R.map(dynamicColumnMapper(data), columns);
};
