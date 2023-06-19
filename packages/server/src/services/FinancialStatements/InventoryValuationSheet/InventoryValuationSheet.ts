import { sumBy, get, isEmpty } from 'lodash';
import * as R from 'ramda';
import FinancialSheet from '../FinancialSheet';
import {
  IItem,
  IInventoryValuationReportQuery,
  IInventoryValuationItem,
  InventoryCostLotTracker,
  IInventoryValuationStatement,
  IInventoryValuationTotal,
} from '@/interfaces';
import { allPassedConditionsPass, transformToMap } from 'utils';

export default class InventoryValuationSheet extends FinancialSheet {
  readonly query: IInventoryValuationReportQuery;
  readonly items: IItem[];
  readonly INInventoryCostLots: Map<number, InventoryCostLotTracker>;
  readonly OUTInventoryCostLots: Map<number, InventoryCostLotTracker>;
  readonly baseCurrency: string;

  /**
   * Constructor method.
   * @param {IInventoryValuationReportQuery} query
   * @param items
   * @param INInventoryCostLots
   * @param OUTInventoryCostLots
   * @param baseCurrency
   */
  constructor(
    query: IInventoryValuationReportQuery,
    items: IItem[],
    INInventoryCostLots: Map<number, InventoryCostLotTracker[]>,
    OUTInventoryCostLots: Map<number, InventoryCostLotTracker[]>,
    baseCurrency: string
  ) {
    super();

    this.query = query;
    this.items = items;
    this.INInventoryCostLots = transformToMap(INInventoryCostLots, 'itemId');
    this.OUTInventoryCostLots = transformToMap(OUTInventoryCostLots, 'itemId');
    this.baseCurrency = baseCurrency;
    this.numberFormat = this.query.numberFormat;
  }

  /**
   * Retrieve the item cost and quantity from the given transaction map.
   * @param {Map<number, InventoryCostLotTracker[]>} transactionsMap
   * @param {number} itemId
   * @returns
   */
  private getItemTransaction(
    transactionsMap: Map<number, InventoryCostLotTracker[]>,
    itemId: number
  ): { cost: number; quantity: number } {
    const meta = transactionsMap.get(itemId);

    const cost = get(meta, 'cost', 0);
    const quantity = get(meta, 'quantity', 0);

    return { cost, quantity };
  }

  /**
   * Retrieve the cost and quantity of the given item from `IN` transactions.
   * @param {number} itemId -
   */
  private getItemINTransaction(itemId: number): {
    cost: number;
    quantity: number;
  } {
    return this.getItemTransaction(this.INInventoryCostLots, itemId);
  }

  /**
   * Retrieve the cost and quantity of the given item from `OUT` transactions.
   * @param {number} itemId -
   */
  private getItemOUTTransaction(itemId: number): {
    cost: number;
    quantity: number;
  } {
    return this.getItemTransaction(this.OUTInventoryCostLots, itemId);
  }

  /**
   * Retrieve the item closing valuation.
   * @param {number} itemId - Item id.
   */
  private getItemValuation(itemId: number): number {
    const { cost: INValuation } = this.getItemINTransaction(itemId);
    const { cost: OUTValuation } = this.getItemOUTTransaction(itemId);

    return Math.max(INValuation - OUTValuation, 0);
  }

  /**
   * Retrieve the item closing quantity.
   * @param {number} itemId - Item id.
   */
  private getItemQuantity(itemId: number): number {
    const { quantity: INQuantity } = this.getItemINTransaction(itemId);
    const { quantity: OUTQuantity } = this.getItemOUTTransaction(itemId);

    return INQuantity - OUTQuantity;
  }

  /**
   * Calculates the item weighted average cost from the given valuation and quantity.
   * @param {number} valuation
   * @param {number} quantity
   * @returns {number}
   */
  private calcAverage(valuation: number, quantity: number): number {
    return quantity ? valuation / quantity : 0;
  }

  /**
   * Mapping the item model object to inventory valuation item
   * @param {IItem} item
   * @returns {IInventoryValuationItem}
   */
  private itemMapper(item: IItem): IInventoryValuationItem {
    const valuation = this.getItemValuation(item.id);
    const quantity = this.getItemQuantity(item.id);
    const average = this.calcAverage(valuation, quantity);

    return {
      id: item.id,
      name: item.name,
      code: item.code,
      valuation,
      quantity,
      average,
      valuationFormatted: this.formatNumber(valuation),
      quantityFormatted: this.formatNumber(quantity, { money: false }),
      averageFormatted: this.formatNumber(average, { money: false }),
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Filter none transactions items.
   * @param {IInventoryValuationItem} valuationItem -
   * @return {boolean}
   */
  private filterNoneTransactions = (
    valuationItem: IInventoryValuationItem
  ): boolean => {
    const transactionIN = this.INInventoryCostLots.get(valuationItem.id);
    const transactionOUT = this.OUTInventoryCostLots.get(valuationItem.id);

    return transactionOUT || transactionIN;
  };

  /**
   * Filter active only items.
   * @param {IInventoryValuationItem} valuationItem -
   * @returns {boolean}
   */
  private filterActiveOnly = (
    valuationItem: IInventoryValuationItem
  ): boolean => {
    return (
      valuationItem.average !== 0 ||
      valuationItem.quantity !== 0 ||
      valuationItem.valuation !== 0
    );
  };

  /**
   * Filter none-zero total valuation items.
   * @param {IInventoryValuationItem} valuationItem
   * @returns {boolean}
   */
  private filterNoneZero = (valuationItem: IInventoryValuationItem) => {
    return valuationItem.valuation !== 0;
  };

  /**
   * Filters the inventory valuation items based on query.
   * @param {IInventoryValuationItem} valuationItem
   * @returns {boolean}
   */
  private itemFilter = (valuationItem: IInventoryValuationItem): boolean => {
    const { noneTransactions, noneZero, onlyActive } = this.query;

    // Conditions pair filter determiner.
    const condsPairFilters = [
      [noneTransactions, this.filterNoneTransactions],
      [noneZero, this.filterNoneZero],
      [onlyActive, this.filterActiveOnly],
    ];
    return allPassedConditionsPass(condsPairFilters)(valuationItem);
  };

  /**
   * Mappes the items to inventory valuation items nodes.
   * @param {IItem[]} items
   * @returns {IInventoryValuationItem[]}
   */
  private itemsMapper = (items: IItem[]): IInventoryValuationItem[] => {
    return this.items.map(this.itemMapper.bind(this));
  };

  /**
   * Filters the inventory valuation items nodes.
   * @param {IInventoryValuationItem[]} nodes -
   * @returns {IInventoryValuationItem[]}
   */
  private itemsFilter = (
    nodes: IInventoryValuationItem[]
  ): IInventoryValuationItem[] => {
    return nodes.filter(this.itemFilter);
  };

  /**
   * Determines whether the items post filter is active.
   */
  private isItemsPostFilter = (): boolean => {
    return isEmpty(this.query.itemsIds);
  };

  /**
   * Retrieve the inventory valuation items.
   * @returns {IInventoryValuationItem[]}
   */
  private itemsSection(): IInventoryValuationItem[] {
    return R.compose(
      R.when(this.isItemsPostFilter, this.itemsFilter),
      this.itemsMapper
    )(this.items);
  }

  /**
   * Retrieve the inventory valuation total.
   * @param {IInventoryValuationItem[]} items
   * @returns {IInventoryValuationTotal}
   */
  private totalSection(
    items: IInventoryValuationItem[]
  ): IInventoryValuationTotal {
    const valuation = sumBy(items, (item) => item.valuation);
    const quantity = sumBy(items, (item) => item.quantity);

    return {
      valuation,
      quantity,
      valuationFormatted: this.formatTotalNumber(valuation),
      quantityFormatted: this.formatTotalNumber(quantity, { money: false }),
    };
  }

  /**
   * Retrieve the inventory valuation report data.
   * @returns {IInventoryValuationStatement}
   */
  public reportData(): IInventoryValuationStatement {
    const items = this.itemsSection();
    const total = this.totalSection(items);

    return items.length > 0 ? { items, total } : {};
  }
}
