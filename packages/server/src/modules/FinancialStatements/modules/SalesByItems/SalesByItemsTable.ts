import { constant, flow } from 'fp-ts/function';
import { isEmpty } from 'lodash';
import { when } from '@/common/fp';
import {
  ISalesByItemsItem,
  ISalesByItemsSheetData,
  ISalesByItemsTotal,
} from './SalesByItems.types';
import { ROW_TYPE } from './constants';
import { FinancialTable } from '../../common/FinancialTable';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { FinancialSheet } from '../../common/FinancialSheet';
import { ITableColumn, ITableRow } from '../../types/Table.types';
import { tableRowMapper } from '../../utils/Table.utils';
import { SALES_BY_ITEMS_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

export class SalesByItemsTable extends flow(
  FinancialTable,
  FinancialSheetStructure,
)(FinancialSheet) {
  private readonly data: ISalesByItemsSheetData;

  /**
   * Constructor method.
   * @param {ISalesByItemsSheetStatement} data
   */
  constructor(data: ISalesByItemsSheetData) {
    super();
    this.data = data;
  }

  /**
   * Retrieves the common table accessors.
   * @returns {ITableColumn[]}
   */
  private commonTableAccessors() {
    return [
      { key: SALES_BY_ITEMS_COLUMN_KEYS.ITEM_NAME, accessor: 'name' },
      {
        key: SALES_BY_ITEMS_COLUMN_KEYS.SOLD_QUANTITY,
        accessor: 'quantitySoldFormatted',
      },
      {
        key: SALES_BY_ITEMS_COLUMN_KEYS.SOLD_AMOUNT,
        accessor: 'soldCostFormatted',
      },
      {
        key: SALES_BY_ITEMS_COLUMN_KEYS.AVERAGE_PRICE,
        accessor: 'averageSellPriceFormatted',
      },
    ];
  }

  /**
   * Maps the given item node to table row.
   * @param {ISalesByItemsItem} item
   * @returns {ITableRow}
   */
  private itemMap = (item: ISalesByItemsItem): ITableRow => {
    const columns = this.commonTableAccessors();
    const meta = {
      rowTypes: [ROW_TYPE.ITEM],
    };
    return tableRowMapper(item, columns, meta);
  };

  /**
   * Maps the given items nodes to table rows.
   * @param {ISalesByItemsItem[]} items
   * @returns {ITableRow[]}
   */
  private itemsMap = (items: ISalesByItemsItem[]): ITableRow[] => {
    return items.map(this.itemMap);
  };

  /**
   * Maps the given total node to table row.
   * @param {ISalesByItemsTotal} total
   * @returns {ITableRow[]}
   */
  private totalMap = (total: ISalesByItemsTotal) => {
    const columns = this.commonTableAccessors();
    const meta = {
      rowTypes: [ROW_TYPE.TOTAL],
    };
    return tableRowMapper(total, columns, meta);
  };

  /**
   * Retrieves the table rows.
   * @returns {ITableRow[]}
   */
  public tableData(): ITableRow[] {
    const itemsRows = this.itemsMap(this.data.items);
    const totalRow = this.totalMap(this.data.total);

    return when(constant(!isEmpty(itemsRows)), (rows: ITableRow[]) => [
      ...rows,
      totalRow,
    ])([...itemsRows]);
  }

  /**
   * Retrieves the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns(): ITableColumn[] {
    const columns = [
      { key: SALES_BY_ITEMS_COLUMN_KEYS.ITEM_NAME, label: 'Item name' },
      { key: SALES_BY_ITEMS_COLUMN_KEYS.SOLD_QUANTITY, label: 'Sold quantity' },
      { key: SALES_BY_ITEMS_COLUMN_KEYS.SOLD_AMOUNT, label: 'Sold amount' },
      { key: SALES_BY_ITEMS_COLUMN_KEYS.AVERAGE_PRICE, label: 'Average price' },
    ];
    return this.tableColumnsCellIndexing(columns);
  }
}
