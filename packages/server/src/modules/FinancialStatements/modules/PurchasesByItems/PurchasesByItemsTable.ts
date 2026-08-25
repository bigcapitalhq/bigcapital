import * as R from 'ramda';
import { ROW_TYPE } from './_types';
import {
  IPurchasesByItemsItem,
  IPurchasesByItemsSheetData,
  IPurchasesByItemsTotal,
} from './types/PurchasesByItems.types';
import {
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
} from '../../types/Table.types';
import { FinancialTable } from '../../common/FinancialTable';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { FinancialSheet } from '../../common/FinancialSheet';
import { tableRowMapper } from '../../utils/Table.utils';
import { PURCHASES_BY_ITEMS_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

export class PurchasesByItemsTable extends R.compose(
  FinancialTable,
  FinancialSheetStructure,
)(FinancialSheet) {
  private data: IPurchasesByItemsSheetData;

  /**
   * Constructor method.
   * @param data
   */
  constructor(data: IPurchasesByItemsSheetData) {
    super();
    this.data = data;
  }

  /**
   * Retrieves thge common table accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private commonTableAccessors(): ITableColumnAccessor[] {
    return [
      { key: PURCHASES_BY_ITEMS_COLUMN_KEYS.ITEM_NAME, accessor: 'name' },
      {
        key: PURCHASES_BY_ITEMS_COLUMN_KEYS.QUANTITY_PURCHASES,
        accessor: 'quantityPurchasedFormatted',
      },
      {
        key: PURCHASES_BY_ITEMS_COLUMN_KEYS.PURCHASE_AMOUNT,
        accessor: 'purchaseCostFormatted',
      },
      {
        key: PURCHASES_BY_ITEMS_COLUMN_KEYS.AVERAGE_COST,
        accessor: 'averageCostPriceFormatted',
      },
    ];
  }

  /**
   * Retrieves the common table columns.
   * @returns {ITableColumn[]}
   */
  private commonTableColumns(): ITableColumn[] {
    return [
      { label: 'Item name', key: PURCHASES_BY_ITEMS_COLUMN_KEYS.ITEM_NAME },
      {
        label: 'Quantity Purchased',
        key: PURCHASES_BY_ITEMS_COLUMN_KEYS.QUANTITY_PURCHASES,
      },
      {
        label: 'Purchase Amount',
        key: PURCHASES_BY_ITEMS_COLUMN_KEYS.PURCHASE_AMOUNT,
      },
      {
        label: 'Average Price',
        key: PURCHASES_BY_ITEMS_COLUMN_KEYS.AVERAGE_COST,
      },
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
      R.when(R.always(R.not(R.isEmpty(itemsRows))), R.append(totalRow)),
    )(itemsRows) as ITableRow[];
  }
}
