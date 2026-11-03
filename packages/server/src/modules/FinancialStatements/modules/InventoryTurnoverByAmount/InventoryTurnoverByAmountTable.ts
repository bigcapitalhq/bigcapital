import { constant, flow } from 'fp-ts/function';
import { isEmpty } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { when } from '@/common/fp';
import { FinancialSheet } from '../../common/FinancialSheet';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { FinancialTable } from '../../common/FinancialTable';
import {
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
} from '../../types/Table.types';
import { tableRowMapper } from '../../utils/Table.utils';
import { INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';
import { ROW_TYPE } from './_constants';
import {
  IInventoryTurnoverByAmountData,
  IInventoryTurnoverByAmountItem,
  IInventoryTurnoverByAmountTotal,
} from './InventoryTurnoverByAmount.types';

export class InventoryTurnoverByAmountTable extends flow(
  FinancialTable,
  FinancialSheetStructure,
)(FinancialSheet) {
  private readonly data: IInventoryTurnoverByAmountData;
  readonly i18n: I18nService;

  /**
   * Constructor method.
   * @param {IInventoryTurnoverByAmountData} data
   * @param {I18nService} i18n
   */
  constructor(data: IInventoryTurnoverByAmountData, i18n: I18nService) {
    super();
    this.data = data;
    this.i18n = i18n;
  }

  /**
   * Retrieve the common columns accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private commonColumnsAccessors(): ITableColumnAccessor[] {
    return [
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.ITEM_NAME,
        accessor: 'name',
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.OPENING_BALANCE,
        accessor: 'openingBalanceFormatted',
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.CLOSING_BALANCE,
        accessor: 'closingBalanceFormatted',
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.COST_OF_GOODS_SOLD,
        accessor: 'costOfGoodsSoldFormatted',
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.AVERAGE_PRICE,
        accessor: 'averagePriceFormatted',
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.TURNOVER_RATIO,
        accessor: 'turnoverRatioFormatted',
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.AVERAGE_TURNOVER_DAYS,
        accessor: 'averageTurnoverDaysFormatted',
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.LAST_SELL_DATE,
        accessor: 'lastSellDateFormatted',
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.QTY_ON_HAND,
        accessor: 'qtyOnHandFormatted',
      },
    ];
  }

  /**
   * Map the given item node to a table row.
   * @param {IInventoryTurnoverByAmountItem} item
   * @returns {ITableRow}
   */
  private itemRowMapper = (item: IInventoryTurnoverByAmountItem): ITableRow => {
    return tableRowMapper(item, this.commonColumnsAccessors(), {
      rowTypes: [ROW_TYPE.ITEM],
    });
  };

  /**
   * Map the given total node to a table row.
   * @param {IInventoryTurnoverByAmountTotal} total
   * @returns {ITableRow}
   */
  private totalRowMapper = (
    total: IInventoryTurnoverByAmountTotal,
  ): ITableRow => {
    return tableRowMapper(total, this.commonColumnsAccessors(), {
      rowTypes: [ROW_TYPE.TOTAL],
    });
  };

  /**
   * Retrieve the table rows.
   * @returns {ITableRow[]}
   */
  public tableRows(): ITableRow[] {
    const itemsRows = this.data.items.map(this.itemRowMapper);
    const totalRow = this.totalRowMapper(this.data.total);

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
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.ITEM_NAME,
        label: this.i18n.t('inventory_turnover_by_amount.item_name'),
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.OPENING_BALANCE,
        label: this.i18n.t('inventory_turnover_by_amount.opening_balance'),
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.CLOSING_BALANCE,
        label: this.i18n.t('inventory_turnover_by_amount.closing_balance'),
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.COST_OF_GOODS_SOLD,
        label: this.i18n.t('inventory_turnover_by_amount.cost_of_goods_sold'),
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.AVERAGE_PRICE,
        label: this.i18n.t('inventory_turnover_by_amount.average_price'),
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.TURNOVER_RATIO,
        label: this.i18n.t('inventory_turnover_by_amount.turnover_ratio'),
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.AVERAGE_TURNOVER_DAYS,
        label: this.i18n.t(
          'inventory_turnover_by_amount.average_turnover_days',
        ),
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.LAST_SELL_DATE,
        label: this.i18n.t('inventory_turnover_by_amount.last_sell_date'),
      },
      {
        key: INVENTORY_TURNOVER_BY_AMOUNT_COLUMN_KEYS.QTY_ON_HAND,
        label: this.i18n.t('inventory_turnover_by_amount.qty_on_hand'),
      },
    ];
    return this.tableColumnsCellIndexing(columns);
  }
}
