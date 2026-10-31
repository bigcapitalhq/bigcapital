import * as moment from 'moment';
import { defaultTo, sumBy } from 'lodash';
import { ModelObject } from 'objection';
import { Item } from '@/modules/Items/models/Item';
import { FinancialSheet } from '../../common/FinancialSheet';
import {
  DEFAULT_REPORT_META,
  IFinancialReportMeta,
} from '../../types/Report.types';
import { InventoryTurnoverByAmountRepository } from './InventoryTurnoverByAmountRepository';
import {
  IInventoryTurnoverByAmountData,
  IInventoryTurnoverByAmountItem,
  IInventoryTurnoverByAmountQuery,
  IInventoryTurnoverByAmountTotal,
  IInventoryTurnoverCostLots,
} from './InventoryTurnoverByAmount.types';

export class InventoryTurnoverByAmount extends FinancialSheet {
  readonly repository: InventoryTurnoverByAmountRepository;
  readonly query: IInventoryTurnoverByAmountQuery;

  /**
   * Constructor method.
   * @param {IInventoryTurnoverByAmountQuery} query
   * @param {InventoryTurnoverByAmountRepository} repository
   * @param {IFinancialReportMeta} meta
   */
  constructor(
    query: IInventoryTurnoverByAmountQuery,
    repository: InventoryTurnoverByAmountRepository,
    meta: IFinancialReportMeta,
  ) {
    super();

    this.repository = repository;
    this.query = query;
    this.baseCurrency = meta.baseCurrency;
    this.numberFormat = this.query.numberFormat;
    this.dateFormat = meta.dateFormat || DEFAULT_REPORT_META.dateFormat;
  }

  /**
   * Retrieve the item cost lots from the given map.
   * @param {Map<number, IInventoryTurnoverCostLots>} costLotsMap
   * @param {number} itemId
   * @returns {IInventoryTurnoverCostLots}
   */
  private getItemCostLots(
    costLotsMap: Map<number, IInventoryTurnoverCostLots>,
    itemId: number,
  ): IInventoryTurnoverCostLots {
    return defaultTo(costLotsMap.get(itemId), { costIn: 0, costOut: 0 });
  }

  /**
   * Retrieve the item opening balance amount.
   * @param {number} itemId
   * @returns {number}
   */
  private getItemOpeningBalance(itemId: number): number {
    const { costIn, costOut } = this.getItemCostLots(
      this.repository.openingCostLotsByItemId,
      itemId,
    );
    return Math.max(costIn - costOut, 0);
  }

  /**
   * Retrieve the item closing balance amount.
   * @param {number} itemId
   * @returns {number}
   */
  private getItemClosingBalance(itemId: number): number {
    const openingCostLots = this.getItemCostLots(
      this.repository.openingCostLotsByItemId,
      itemId,
    );
    const periodCostLots = this.getItemCostLots(
      this.repository.periodCostLotsByItemId,
      itemId,
    );
    const valuation =
      openingCostLots.costIn -
      openingCostLots.costOut +
      periodCostLots.costIn -
      periodCostLots.costOut;

    return Math.max(valuation, 0);
  }

  /**
   * Retrieve the item cost of goods sold amount.
   * @param {number} itemId
   * @returns {number}
   */
  private getItemCostOfGoodsSold(itemId: number): number {
    const { costIn, costOut } = this.getItemCostLots(
      this.repository.periodSalesCostLotsByItemId,
      itemId,
    );
    // Sales returns increase inventory and reverse the cost of goods sold.
    return costOut - costIn;
  }

  /**
   * Retrieve the item average inventory price.
   * @param {number} openingBalance
   * @param {number} closingBalance
   * @returns {number}
   */
  private getItemAveragePrice(
    openingBalance: number,
    closingBalance: number,
  ): number {
    return (openingBalance + closingBalance) / 2;
  }

  /**
   * Calculate the turnover ratio.
   * @param {number} costOfGoodsSold
   * @param {number} averagePrice
   * @returns {number}
   */
  private getTurnoverRatio(
    costOfGoodsSold: number,
    averagePrice: number,
  ): number {
    return averagePrice ? costOfGoodsSold / averagePrice : 0;
  }

  /**
   * Calculate the average turnover days.
   * @param {number} turnoverRatio
   * @returns {number}
   */
  private getAverageTurnoverDays(turnoverRatio: number): number {
    const periodDays = this.getPeriodDays();
    return turnoverRatio ? periodDays / turnoverRatio : 0;
  }

  /**
   * Retrieve the number of days in the report period.
   * @returns {number}
   */
  private getPeriodDays(): number {
    const periodDays =
      moment(this.query.toDate).diff(moment(this.query.fromDate), 'days') + 1;
    return Math.max(periodDays, 0);
  }

  /**
   * Map the given item to the report item.
   * @param {ModelObject<Item>} item
   * @returns {IInventoryTurnoverByAmountItem}
   */
  private itemMapper(item: ModelObject<Item>): IInventoryTurnoverByAmountItem {
    const openingBalance = this.getItemOpeningBalance(item.id);
    const closingBalance = this.getItemClosingBalance(item.id);
    const costOfGoodsSold = this.getItemCostOfGoodsSold(item.id);
    const averagePrice = this.getItemAveragePrice(
      openingBalance,
      closingBalance,
    );
    const turnoverRatio = this.getTurnoverRatio(costOfGoodsSold, averagePrice);
    const averageTurnoverDays = this.getAverageTurnoverDays(turnoverRatio);
    const qtyOnHand = defaultTo(
      this.repository.closingQuantitiesByItemId.get(item.id),
      0,
    );
    const lastSellDate = defaultTo(
      this.repository.lastSellDatesByItemId.get(item.id),
      null,
    );

    return {
      id: item.id,
      name: item.name,
      code: item.code,

      openingBalance,
      closingBalance,
      costOfGoodsSold,
      averagePrice,
      turnoverRatio,
      averageTurnoverDays,
      qtyOnHand,
      lastSellDate,

      openingBalanceFormatted: this.formatNumber(openingBalance),
      closingBalanceFormatted: this.formatNumber(closingBalance),
      costOfGoodsSoldFormatted: this.formatNumber(costOfGoodsSold),
      averagePriceFormatted: this.formatNumber(averagePrice),
      turnoverRatioFormatted: this.formatNumber(turnoverRatio, {
        money: false,
      }),
      averageTurnoverDaysFormatted: this.formatNumber(averageTurnoverDays, {
        money: false,
      }),
      qtyOnHandFormatted: this.formatNumber(qtyOnHand, { money: false }),
      lastSellDateFormatted: lastSellDate
        ? this.getDateFormatted(lastSellDate)
        : '',

      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Determines whether the given item has activity in the report.
   * @param {IInventoryTurnoverByAmountItem} item
   * @returns {boolean}
   */
  private itemsFilter = (item: IInventoryTurnoverByAmountItem): boolean => {
    return (
      item.openingBalance !== 0 ||
      item.closingBalance !== 0 ||
      item.costOfGoodsSold !== 0 ||
      item.qtyOnHand !== 0 ||
      !!item.lastSellDate
    );
  };

  /**
   * Retrieve the report items section.
   * @returns {IInventoryTurnoverByAmountItem[]}
   */
  private itemsSection(): IInventoryTurnoverByAmountItem[] {
    return this.repository.inventoryItems
      .map((item) => this.itemMapper(item))
      .filter(this.itemsFilter);
  }

  /**
   * Retrieve the report total section.
   * @param {IInventoryTurnoverByAmountItem[]} items
   * @returns {IInventoryTurnoverByAmountTotal}
   */
  private totalSection(
    items: IInventoryTurnoverByAmountItem[],
  ): IInventoryTurnoverByAmountTotal {
    const openingBalance = sumBy(items, 'openingBalance');
    const closingBalance = sumBy(items, 'closingBalance');
    const costOfGoodsSold = sumBy(items, 'costOfGoodsSold');
    const averagePrice = sumBy(items, 'averagePrice');
    const qtyOnHand = sumBy(items, 'qtyOnHand');
    const turnoverRatio = this.getTurnoverRatio(costOfGoodsSold, averagePrice);
    const averageTurnoverDays = this.getAverageTurnoverDays(turnoverRatio);

    return {
      openingBalance,
      closingBalance,
      costOfGoodsSold,
      averagePrice,
      turnoverRatio,
      averageTurnoverDays,
      qtyOnHand,
      lastSellDate: null,

      openingBalanceFormatted: this.formatTotalNumber(openingBalance),
      closingBalanceFormatted: this.formatTotalNumber(closingBalance),
      costOfGoodsSoldFormatted: this.formatTotalNumber(costOfGoodsSold),
      averagePriceFormatted: this.formatTotalNumber(averagePrice),
      turnoverRatioFormatted: this.formatTotalNumber(turnoverRatio, {
        money: false,
      }),
      averageTurnoverDaysFormatted: this.formatTotalNumber(
        averageTurnoverDays,
        { money: false },
      ),
      qtyOnHandFormatted: this.formatTotalNumber(qtyOnHand, { money: false }),
      lastSellDateFormatted: '',

      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Retrieve the inventory turnover report data.
   * @returns {IInventoryTurnoverByAmountData}
   */
  public reportData(): IInventoryTurnoverByAmountData {
    const items = this.itemsSection();
    const total = this.totalSection(items);

    return { items, total };
  }
}
