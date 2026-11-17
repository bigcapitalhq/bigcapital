import { constant, flow } from 'fp-ts/function';
import { isEmpty } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { when } from '@/common/fp';
import {
  IInventorySummaryData,
  IInventorySummaryItem,
  IInventorySummaryTotal,
} from './InventorySummary.types';
import { ROW_TYPE } from './constants';
import { FinancialTable } from '../../common/FinancialTable';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { FinancialSheet } from '../../common/FinancialSheet';
import { ITableColumn, ITableRow } from '../../types/Table.types';
import { tableRowMapper } from '../../utils/Table.utils';
import { INVENTORY_SUMMARY_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

export class InventorySummaryTable extends flow(
  FinancialTable,
  FinancialSheetStructure,
)(FinancialSheet) {
  private readonly data: IInventorySummaryData;
  readonly i18n: I18nService;

  /**
   * Constructor method.
   * @param {IInventorySummaryData} data
   * @param {I18nService} i18n
   */
  constructor(data: IInventorySummaryData, i18n: I18nService) {
    super();
    this.data = data;
    this.i18n = i18n;
  }

  /**
   * Retrieve the common table accessors.
   * @returns {Array<{ key: string; accessor: string }>}
   */
  private commonTableAccessors() {
    return [
      {
        key: INVENTORY_SUMMARY_COLUMN_KEYS.ITEM_NAME,
        accessor: 'name',
      },
      {
        key: INVENTORY_SUMMARY_COLUMN_KEYS.OPENING_STOCK,
        accessor: 'openingStockFormatted',
      },
      {
        key: INVENTORY_SUMMARY_COLUMN_KEYS.QUANTITY_IN,
        accessor: 'quantityInFormatted',
      },
      {
        key: INVENTORY_SUMMARY_COLUMN_KEYS.QUANTITY_OUT,
        accessor: 'quantityOutFormatted',
      },
      {
        key: INVENTORY_SUMMARY_COLUMN_KEYS.CLOSING_STOCK,
        accessor: 'closingStockFormatted',
      },
    ];
  }

  /**
   * Maps the given item node to a table row.
   * @param {IInventorySummaryItem} item
   * @returns {ITableRow}
   */
  private itemMap = (item: IInventorySummaryItem): ITableRow => {
    return tableRowMapper(item, this.commonTableAccessors(), {
      rowTypes: [ROW_TYPE.ITEM],
      id: item.id,
    });
  };

  /**
   * Maps the given items nodes to table rows.
   * @param {IInventorySummaryItem[]} items
   * @returns {ITableRow[]}
   */
  private itemsMap = (items: IInventorySummaryItem[]): ITableRow[] => {
    return items.map(this.itemMap);
  };

  /**
   * Maps the given total node to a table row.
   * @param {IInventorySummaryTotal} total
   * @returns {ITableRow}
   */
  private totalMap = (total: IInventorySummaryTotal): ITableRow => {
    return tableRowMapper(total, this.commonTableAccessors(), {
      rowTypes: [ROW_TYPE.TOTAL],
    });
  };

  /**
   * Retrieve the table rows.
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
   * Retrieve the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns(): ITableColumn[] {
    const columns = [
      {
        key: INVENTORY_SUMMARY_COLUMN_KEYS.ITEM_NAME,
        label: this.i18n.t('inventory_summary.item_name'),
      },
      {
        key: INVENTORY_SUMMARY_COLUMN_KEYS.OPENING_STOCK,
        label: this.i18n.t('inventory_summary.opening_stock'),
      },
      {
        key: INVENTORY_SUMMARY_COLUMN_KEYS.QUANTITY_IN,
        label: this.i18n.t('inventory_summary.quantity_in'),
      },
      {
        key: INVENTORY_SUMMARY_COLUMN_KEYS.QUANTITY_OUT,
        label: this.i18n.t('inventory_summary.quantity_out'),
      },
      {
        key: INVENTORY_SUMMARY_COLUMN_KEYS.CLOSING_STOCK,
        label: this.i18n.t('inventory_summary.closing_stock'),
      },
    ];
    return this.tableColumnsCellIndexing(columns);
  }
}
