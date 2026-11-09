import * as FA from 'fp-ts/Array';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';
import type { PurchasesByItemsColumnKey } from '@bigcapital/sdk-ts';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { firstMatch, when } from '@/utils/fp';

const getTableCellValueAccessor = (index: number) => `cells[${index}].value`;

const isColumnKey =
  (key: PurchasesByItemsColumnKey): FF.Predicate<Record<string, any>> =>
  (column) =>
    column.key === key;

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
const commonColumnMapper =
  (data: any[]) =>
  (column: Record<string, any>): Record<string, any> => {
    const accessor = getTableCellValueAccessor(column.cellIndex);

    return {
      key: column.key,
      Header: column.label,
      accessor,
      className: column.key,
      textOverview: true,
    };
  };

/**
 * Numeric columns accessor.
 */
const numericColumnAccessor =
  (data: any[]) =>
  (column: Record<string, any>): Record<string, any> => {
    const accessor = getTableCellValueAccessor(column.cellIndex);
    const width = getReportColWidth(data, accessor, column.label);

    return {
      ...column,
      align: Align.Right,
      width,
      money: true,
    };
  };

/**
 * Item name column accessor.
 */
const itemNameColumnAccessor =
  (data: any[]) =>
  (column: Record<string, any>): Record<string, any> => {
    return {
      ...column,
      width: 180,
    };
  };

const dynamicColumnMatchers = (data: any[]) => [
  when(isColumnKey('item_name'), itemNameColumnAccessor(data)),
  when(isColumnKey('quantity_purchases'), numericColumnAccessor(data)),
  when(isColumnKey('purchase_amount'), numericColumnAccessor(data)),
  when(isColumnKey('average_cost'), numericColumnAccessor(data)),
];

const dynamicColumnMapper =
  (data: any[]) =>
  (column: Record<string, any>): Record<string, any> => {
    const fallback = commonColumnMapper(data)(column);

    return FF.pipe(
      fallback,
      firstMatch(dynamicColumnMatchers(data)),
      FO.match(() => fallback, FF.identity),
    );
  };

/**
 * Composes the dynamic columns that fetched from request to columns to table component.
 */
export const dynamicColumns = (data: any[], columns: Record<string, any>[]) => {
  return FF.pipe(columns, FA.map(dynamicColumnMapper(data)));
};

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
