import * as R from 'ramda';
import { useInventoryValuationContext } from './InventoryValuationProvider';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const getReportColWidth = (
  data: unknown[],
  accessor: string,
  headerText?: string,
) => {
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
const commonAccessor = R.curry(
  (data: unknown[], column: Record<string, any>) => {
    const accessor = getTableCellValueAccessor(column.cellIndex);

    return {
      key: column.key,
      Header: column.label,
      accessor,
      className: column.key,
      textOverview: true,
      align: Align.Left,
    };
  },
);

/**
 * Numeric columns accessor.
 */
const numericColumnAccessor = R.curry(
  (data: unknown[], column: Record<string, any>) => {
    const accessor = getTableCellValueAccessor(column.cellIndex);
    const width = getReportColWidth(data, accessor, column.label);

    return {
      ...column,
      align: Align.Right,
      money: true,
      width,
    };
  },
);

/**
 * Item name column accessor.
 */
const itemNameColumnAccessor = R.curry(
  (data: unknown[], column: Record<string, any>) => {
    return {
      ...column,
      width: 240,
    };
  },
);

/**
 * Dynamic column mapper.
 */
const dynamicColumnMapper = R.curry(
  (data: unknown[], column: Record<string, any>) => {
    const _commonAccessor = commonAccessor(data);
    const _numericColumnAccessor = numericColumnAccessor(data);
    const _itemNameColumnAccessor = itemNameColumnAccessor(data);

    return R.compose(
      R.when(R.pathEq(['key'], 'itemName'), _itemNameColumnAccessor),
      R.when(R.pathEq(['key'], 'quantity'), _numericColumnAccessor),
      R.when(R.pathEq(['key'], 'valuation'), _numericColumnAccessor),
      R.when(R.pathEq(['key'], 'average'), _numericColumnAccessor),
      _commonAccessor,
    )(column);
  },
);

/**
 * Composes the fetched dynamic columns from the server to the columns to pass it
 * to the table component.
 */
export const dynamicColumns = (
  columns: Record<string, any>[],
  data: unknown[],
) => {
  return R.map(dynamicColumnMapper(data), columns);
};

/**
 * Retrieves the table columns of inventory valuation sheet.
 */
export const useInventoryValuationColumns = () => {
  const { inventoryValuation } = useInventoryValuationContext();

  if (!inventoryValuation) {
    throw new Error('The inventory valuation is not loaded');
  }
  const table = (inventoryValuation as any).table;

  return dynamicColumns(table.columns, table.rows);
};
