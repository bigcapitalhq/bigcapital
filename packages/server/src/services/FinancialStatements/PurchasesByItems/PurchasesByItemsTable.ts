import * as R from 'ramda';
import { ITableColumn, ITableColumnAccessor, ITableRow } from '@/interfaces';
import { ROW_TYPE } from './_types';
import { tableRowMapper } from '@/utils';
import { FinancialTable } from '../FinancialTable';
import { FinancialSheetStructure } from '../FinancialSheetStructure';
import FinancialSheet from '../FinancialSheet';
import {
  IPurchasesByItemsItem,
  IPurchasesByItemsSheetData,
  IPurchasesByItemsTotal,
} from '@/interfaces/PurchasesByItemsSheet';

export class PurchasesByItemsTable extends R.compose(
  FinancialTable,
  FinancialSheetStructure
)(FinancialSheet) {
  private data: IPurchasesByItemsSheetData;

  /**
   * Constructor method.
   * @param data
   */
  constructor(data) {
    super();
    this.data = data;
  }

  /**
   * Retrieves thge common table accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private commonTableAccessors(): ITableColumnAccessor[] {
    return [
      { key: 'item_name', accessor: 'name' },
      { key: 'quantity_purchases', accessor: 'quantityPurchasedFormatted' },
      { key: 'purchase_amount', accessor: 'purchaseCostFormatted' },
      { key: 'average_cost', accessor: 'averageCostPriceFormatted' },
    ];
  }

  /**
   * Retrieves the common table columns.
   * @returns {ITableColumn[]}
   */
  private commonTableColumns(): ITableColumn[] {
    return [
      { label: 'Item name', key: 'item_name' },
      { label: 'Quantity Purchased', key: 'quantity_purchases' },
      { label: 'Purchase Amount', key: 'purchase_amount' },
      { label: 'Average Price', key: 'average_cost' },
    ];
  }

  /**
   * Maps the given item node to table row.
   * @param {IPurchasesByItemsItem} item
   * @returns {ITableRow}
   */
  private itemMap = (item: IPurchasesByItemsItem): ITableRow => {
    const columns = this.commonTableAccessors();
    const meta = {
      rowTypes: [ROW_TYPE.ITEM],
    };
    return tableRowMapper(item, columns, meta);
  };

  /**
   * Maps the given items nodes to table rows.
   * @param {IPurchasesByItemsItem[]} items - Items nodes.
   * @returns {ITableRow[]}
   */
  private itemsMap = (items: IPurchasesByItemsItem[]): ITableRow[] => {
    return R.map(this.itemMap)(items);
  };

  /**
   * Maps the given total node to table rows.
   * @param {IPurchasesByItemsTotal} total
   * @returns {ITableRow}
   */
  private totalNodeMap = (total: IPurchasesByItemsTotal): ITableRow => {
    const columns = this.commonTableAccessors();
    const meta = {
      rowTypes: [ROW_TYPE.TOTAL],
    };
    return tableRowMapper(total, columns, meta);
  };

  /**
   * Retrieves the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns(): ITableColumn[] {
    const columns = this.commonTableColumns();
    return R.compose(this.tableColumnsCellIndexing)(columns);
  }

  /**
   * Retrieves the table rows.
   * @returns {ITableRow[]}
   */
  public tableData(): ITableRow[] {
    const itemsRows = this.itemsMap(this.data.items);
    const totalRow = this.totalNodeMap(this.data.total);

    return R.compose(
      R.when(R.always(R.not(R.isEmpty(itemsRows))), R.append(totalRow))
    )(itemsRows) as ITableRow[];
  }
}
