import * as R from 'ramda';
import {
  IInventoryValuationItem,
  IInventoryValuationSheetData,
  IInventoryValuationTotal,
} from './InventoryValuationSheet.types';
import { ROW_TYPE } from './_constants';
import { FinancialTable } from '../../common/FinancialTable';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { FinancialSheet } from '../../common/FinancialSheet';
import {
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
} from '../../types/Table.types';
import { tableRowMapper } from '../../utils/Table.utils';
import { INVENTORY_VALUATION_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

export class InventoryValuationSheetTable extends R.pipe(
  FinancialTable,
  FinancialSheetStructure,
)(FinancialSheet) {
  private readonly data: IInventoryValuationSheetData;

  /**
   * Constructor method.
   * @param {IInventoryValuationSheetData} data
   */
  constructor(data: IInventoryValuationSheetData) {
    super();
    this.data = data;
  }

  /**
   * Retrieves the common columns accessors.
   * @returns {ITableColumnAccessor}
   */
  private commonColumnsAccessors(): ITableColumnAccessor[] {
    return [
      { key: INVENTORY_VALUATION_COLUMN_KEYS.ITEM_NAME, accessor: 'name' },
      {
        key: INVENTORY_VALUATION_COLUMN_KEYS.QUANTITY,
        accessor: 'quantityFormatted',
      },
      {
        key: INVENTORY_VALUATION_COLUMN_KEYS.VALUATION,
        accessor: 'valuationFormatted',
      },
      {
        key: INVENTORY_VALUATION_COLUMN_KEYS.AVERAGE,
        accessor: 'averageFormatted',
      },
    ];
  }

  /**
   * Maps the given total node to table row.
   * @param {IInventoryValuationTotal} total
   * @returns {ITableRow}
   */
  private totalRowMapper = (total: IInventoryValuationTotal): ITableRow => {
    const accessors = this.commonColumnsAccessors();
    const meta = {
      rowTypes: [ROW_TYPE.TOTAL],
    };
    return tableRowMapper(total, accessors, meta);
  };

  /**
   * Maps the given item node to table row.
   * @param {IInventoryValuationItem} item
   * @returns {ITableRow}
   */
  private itemRowMapper = (item: IInventoryValuationItem): ITableRow => {
    const accessors = this.commonColumnsAccessors();
    const meta = {
      rowTypes: [ROW_TYPE.ITEM],
    };
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
  public tableRows(): ITableRow[] {
    const itemsRows = this.itemsRowsMapper(this.data.items);
    const totalRow = this.totalRowMapper(this.data.total);

    return R.compose(
      R.when(R.always(R.not(R.isEmpty(itemsRows))), R.append(totalRow)),
    )([...itemsRows]) as ITableRow[];
  }

  /**
   * Retrieves the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns(): ITableColumn[] {
    const columns = [
      { key: INVENTORY_VALUATION_COLUMN_KEYS.ITEM_NAME, label: 'Item Name' },
      { key: INVENTORY_VALUATION_COLUMN_KEYS.QUANTITY, label: 'Quantity' },
      { key: INVENTORY_VALUATION_COLUMN_KEYS.VALUATION, label: 'Valuation' },
      { key: INVENTORY_VALUATION_COLUMN_KEYS.AVERAGE, label: 'Average' },
    ];
    return R.compose(this.tableColumnsCellIndexing)(columns);
  }
}
