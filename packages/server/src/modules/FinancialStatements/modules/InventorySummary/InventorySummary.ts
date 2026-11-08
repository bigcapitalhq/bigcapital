import { ModelObject } from 'objection';
import { sumBy } from 'lodash';
import { Item } from '@/modules/Items/models/Item';
import {
  IInventorySummaryData,
  IInventorySummaryItem,
  IInventorySummaryQuery,
  IInventorySummaryTotal,
} from './InventorySummary.types';
import { FinancialSheet } from '../../common/FinancialSheet';
import {
  DEFAULT_REPORT_META,
  IFinancialReportMeta,
} from '../../types/Report.types';
import { InventorySummaryRepository } from './InventorySummaryRepository';

export class InventorySummaryReport extends FinancialSheet {
  readonly query: IInventorySummaryQuery;
  readonly repository: InventorySummaryRepository;

  /**
   * Constructor method.
   * @param {IInventorySummaryQuery} query - Inventory summary query.
   * @param {InventorySummaryRepository} repository - Inventory summary repository.
   * @param {IFinancialReportMeta} meta - Report meta.
   */
  constructor(
    query: IInventorySummaryQuery,
    repository: InventorySummaryRepository,
    meta: IFinancialReportMeta,
  ) {
    super();

    this.query = query;
    this.repository = repository;
    this.baseCurrency = meta.baseCurrency;
    this.numberFormat = this.query.numberFormat;
    this.dateFormat = meta.dateFormat || DEFAULT_REPORT_META.dateFormat;
  }

  /**
   * Maps an item to an inventory summary item node.
   * @param {ModelObject<Item>} item
   * @returns {IInventorySummaryItem}
   */
  private itemMapper(item: ModelObject<Item>): IInventorySummaryItem {
    const openingStock = this.repository.openingStockByItemId.get(item.id) ?? 0;
    const periodTotals = this.repository.periodTotalsByItemId.get(item.id) ?? {
      quantityIn: 0,
      quantityOut: 0,
    };

    const quantityIn = periodTotals.quantityIn;
    const quantityOut = periodTotals.quantityOut;
    const closingStock = openingStock + quantityIn - quantityOut;

    return {
      id: item.id,
      name: item.name,
      code: item.code,

      openingStock,
      quantityIn,
      quantityOut,
      closingStock,

      openingStockFormatted: this.formatNumber(openingStock, { money: false }),
      quantityInFormatted: this.formatNumber(quantityIn, { money: false }),
      quantityOutFormatted: this.formatNumber(quantityOut, { money: false }),
      closingStockFormatted: this.formatNumber(closingStock, { money: false }),
    };
  }

  /**
   * Determines whether the given item has any stock movement.
   * @param {IInventorySummaryItem} item
   * @returns {boolean}
   */
  private filterNoneTransactions = (item: IInventorySummaryItem): boolean => {
    return (
      item.openingStock !== 0 || item.quantityIn !== 0 || item.quantityOut !== 0
    );
  };

  /**
   * Filters the inventory summary items based on the report query.
   * @param {IInventorySummaryItem} item
   * @returns {boolean}
   */
  private itemFilter = (item: IInventorySummaryItem): boolean => {
    return this.query.noneTransactions
      ? this.filterNoneTransactions(item)
      : true;
  };

  /**
   * Retrieve the inventory summary items.
   * @returns {IInventorySummaryItem[]}
   */
  private itemsSection(): IInventorySummaryItem[] {
    return this.repository.items
      .map((item) => this.itemMapper(item))
      .filter(this.itemFilter);
  }

  /**
   * Retrieve the inventory summary totals.
   * @param {IInventorySummaryItem[]} items
   * @returns {IInventorySummaryTotal}
   */
  private totalSection(items: IInventorySummaryItem[]): IInventorySummaryTotal {
    const openingStock = sumBy(items, 'openingStock');
    const quantityIn = sumBy(items, 'quantityIn');
    const quantityOut = sumBy(items, 'quantityOut');
    const closingStock = openingStock + quantityIn - quantityOut;

    return {
      openingStock,
      quantityIn,
      quantityOut,
      closingStock,

      openingStockFormatted: this.formatTotalNumber(openingStock, {
        money: false,
      }),
      quantityInFormatted: this.formatTotalNumber(quantityIn, { money: false }),
      quantityOutFormatted: this.formatTotalNumber(quantityOut, {
        money: false,
      }),
      closingStockFormatted: this.formatTotalNumber(closingStock, {
        money: false,
      }),
    };
  }

  /**
   * Retrieve the inventory summary report data.
   * @returns {IInventorySummaryData}
   */
  public reportData(): IInventorySummaryData {
    const items = this.itemsSection();
    const total = this.totalSection(items);

    return { items, total };
  }
}
