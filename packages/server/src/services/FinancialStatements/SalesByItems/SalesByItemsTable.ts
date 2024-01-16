import * as R from 'ramda';
import { ISalesByItemsSheetStatement, ITableColumn, ITableData, ITableRow } from '@/interfaces';
import { tableRowMapper } from '@/utils';

export class SalesByItemsTable {
  private readonly data: ISalesByItemsSheetStatement;

  constructor(data: ISalesByItemsSheetStatement) {
    this.data = data;
  }

  private commonTableAccessors() {
    return [
      { key: 'item_name', accessor: 'name' },
      { key: 'quantity', accessor: 'quantitySoldFormatted' },
      { key: 'sold', accessor: 'soldCostFormatted' },
    ];
  }

  private itemMap(item: any) {
    const columns = this.commonTableAccessors();
    const meta = {};

    return tableRowMapper(item, columns, meta);
  }

  private itemsMap(items: any[]) {
    return R.map(this.itemMap, items);
  }

  /**
   * 
   * @param total 
   * @returns 
   */
  private totalMap(total: any) {
    const columns = this.commonTableAccessors();
    const meta = {};

    return tableRowMapper(total, columns, meta);
  }

  /**
   * 
   * @returns {ITableRow[]}
   */
  public tableData(): ITableRow[] {
    const itemsRows = this.itemsMap(this.data.items);
    const totalRow = this.totalMap(this.data.total);

    return [...itemsRows, totalRow];
  }

  /**
   * Retrieves the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns(): ITableColumn[] {
    return [
      { key: 'item_name', label: 'Item Name' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'sold_cost', label: 'Sold Cost' },
    ];
  }
}
