import * as R from 'ramda';
import {
  ISalesByItemsItem,
  ISalesByItemsSheetStatement,
  ISalesByItemsTotal,
  ITableColumn,
  ITableRow,
} from '@/interfaces';
import { tableRowMapper } from '@/utils';
import FinancialSheet from '../FinancialSheet';
import { FinancialSheetStructure } from '../FinancialSheetStructure';
import { FinancialTable } from '../FinancialTable';
import { ROW_TYPE } from './constants';

export class SalesByItemsTable extends R.compose(
  FinancialTable,
  FinancialSheetStructure
)(FinancialSheet) {
  private readonly data: ISalesByItemsSheetStatement;

  /**
   * Constructor method.
   * @param {ISalesByItemsSheetStatement} data
   */
  constructor(data: ISalesByItemsSheetStatement) {
    super();
    this.data = data;
  }

  /**
   * Retrieves the common table accessors.
   * @returns {ITableColumn[]}
   */
  private commonTableAccessors() {
    return [
      { key: 'item_name', accessor: 'name' },
      { key: 'sold_quantity', accessor: 'quantitySoldFormatted' },
      { key: 'sold_amount', accessor: 'soldCostFormatted' },
      { key: 'average_price', accessor: 'averageSellPriceFormatted' },
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
    return R.map(this.itemMap, items);
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

    return R.compose(
      R.when(R.always(R.not(R.isEmpty(itemsRows))), R.append(totalRow))
    )([...itemsRows]) as ITableRow[];
  }

  /**
   * Retrieves the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns(): ITableColumn[] {
    const columns = [
      { key: 'item_name', label: 'Item name' },
      { key: 'sold_quantity', label: 'Sold quantity' },
      { key: 'sold_amount', label: 'Sold amount' },
      { key: 'average_price', label: 'Average price' },
    ];
    return R.compose(this.tableColumnsCellIndexing)(columns);
  }
}
