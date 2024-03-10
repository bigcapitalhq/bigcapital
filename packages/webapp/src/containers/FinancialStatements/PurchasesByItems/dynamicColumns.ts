// @ts-nocheck
import { getColumnWidth } from '@/utils';
import * as R from 'ramda';
import { Align } from '@/constants';
import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';

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
 * Item name column accessor.
 */
const itemNameColumnAccessor = R.curry((data, column) => {
  return {
    ...column,
    width: 180,
  };
});

const dynamiColumnMapper = R.curry((data, column) => {
  const _numericColumnAccessor = numericColumnAccessor(data);
  const _itemNameColumnAccessor = itemNameColumnAccessor(data);

  return R.compose(
    R.when(R.pathEq(['key'], 'item_name'), _itemNameColumnAccessor),
    R.when(R.pathEq(['key'], 'quantity_purchases'), _numericColumnAccessor),
    R.when(R.pathEq(['key'], 'purchase_amount'), _numericColumnAccessor),
    R.when(R.pathEq(['key'], 'average_cost'), _numericColumnAccessor),
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
 * Retrieves the purchases by items sheet table columns for table component.
 */
export const usePurchasesByItemsTableColumns = () => {
  const { purchaseByItems } = usePurchaseByItemsContext();

  if (!purchaseByItems) {
    throw new Error('Purchases by items context not found');
  }
  const { table } = purchaseByItems;

  return dynamicColumns(table.rows, table.columns);
};
