import * as R from 'ramda';
import {
  IInventoryValuationItem,
  IInventoryValuationSheetData,
  IInventoryValuationTotal,
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
} from '@/interfaces';
import { tableRowMapper } from '@/utils';

export class InventoryValuationSheetTable {
  private readonly data: IInventoryValuationSheetData;

  /**
   * Constructor method.
   * @param {IInventoryValuationSheetData} data
   */
  constructor(data: IInventoryValuationSheetData) {
    this.data = data;
  }

  /**
   * Retrieves the common columns accessors.
   * @returns {ITableColumnAccessor}
   */
  private commonColumnsAccessors(): ITableColumnAccessor[] {
    return [
      { key: 'item_name', accessor: 'name' },
      { key: 'quantity', accessor: 'quantityFormatted' },
      { key: 'valuation', accessor: 'valuationFormatted' },
      { key: 'average', accessor: 'averageFormatted' },
    ];
  }

  /**
   * Maps the given total node to table row.
   * @param {IInventoryValuationTotal} total
   * @returns {ITableRow}
   */
  private totalRowMapper = (total: IInventoryValuationTotal): ITableRow => {
    const accessors = this.commonColumnsAccessors();
    const meta = {};

    return tableRowMapper(total, accessors, meta);
  };

  /**
   * Maps the given item node to table row.
   * @param {IInventoryValuationItem} item
   * @returns {ITableRow}
   */
  private itemRowMapper = (item: IInventoryValuationItem): ITableRow => {
    const accessors = this.commonColumnsAccessors();
    const meta = {};

    return tableRowMapper(item, accessors, meta);
  };

  /**
   * Maps the given items nodes to table rowes.
   * @param {IInventoryValuationItem[]} items
   * @returns {ITableRow[]}
   */
  private itemsRowsMapper = (items: IInventoryValuationItem[]): ITableRow[] => {
    return R.map(this.itemRowMapper)(items);
  };

  /**
   * Retrieves the table rows.
   * @returns {ITableRow[]}
   */
  public tableRows() {
    const itemsRows = this.itemsRowsMapper(this.data.items);
    const totalRow = this.totalRowMapper(this.data.total);

    return [...itemsRows, totalRow];
  }

  /**
   *
   * @returns {ITableColumn[]}
   */
  public tableColumns(): ITableColumn[] {
    return [
      { key: 'item_name', label: 'Item Name' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'valuation', label: 'Valuation' },
      { key: 'average', label: 'Average' },
    ];
  }
}
