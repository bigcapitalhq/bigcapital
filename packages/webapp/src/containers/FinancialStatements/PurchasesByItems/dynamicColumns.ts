import * as R from 'ramda';
import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const getReportColWidth = (
  data: any[],
  accessor: string,
  headerText: string,
) => {
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
const commonColumnMapper = R.curry(
  (data: any[], column: Record<string, any>) => {
    const accessor = getTableCellValueAccessor(column.cellIndex);

    return {
      key: column.key,
      Header: column.label,
      accessor,
      className: column.key,
      textOverview: true,
    };
  },
);

/**
 * Numeric columns accessor.
 */
const numericColumnAccessor = R.curry(
  (data: any[], column: Record<string, any>) => {
    const accessor = getTableCellValueAccessor(column.cellIndex);
    const width = getReportColWidth(data, accessor, column.label);

    return {
      ...column,
      align: Align.Right,
      width,
      money: true,
    };
  },
);

/**
 * Item name column accessor.
 */
const itemNameColumnAccessor = R.curry(
  (data: any[], column: Record<string, any>) => {
    return {
      ...column,
      width: 180,
    };
  },
);

const dynamicColumnMapper = R.curry(
  (data: any[], column: Record<string, any>) => {
    const _numericColumnAccessor = numericColumnAccessor(data);
    const _itemNameColumnAccessor = itemNameColumnAccessor(data);

    return R.compose(
      R.when(R.pathEq(['key'], 'itemName'), _itemNameColumnAccessor),
      R.when(R.pathEq(['key'], 'quantityPurchases'), _numericColumnAccessor),
      R.when(R.pathEq(['key'], 'purchaseAmount'), _numericColumnAccessor),
      R.when(R.pathEq(['key'], 'averageCost'), _numericColumnAccessor),
      commonColumnMapper(data),
    )(column);
  },
);

/**
 * Composes the dynamic columns that fetched from request to columns to table component.
 */
export const dynamicColumns = R.curry(
  (data: any[], columns: Record<string, any>[]) => {
    return R.map(dynamicColumnMapper(data), columns);
  },
);

/**
 * Retrieves the purchases by items sheet table columns for table component.
 */
export const usePurchasesByItemsTableColumns = () => {
  const { purchaseByItems } = usePurchaseByItemsContext();

  if (!purchaseByItems) {
    throw new Error('Purchases by items context not found');
  }
  const table = (purchaseByItems as any).table;

  return dynamicColumns(table.rows, table.columns);
};
