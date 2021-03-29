import { sumBy, get } from 'lodash';
import FinancialSheet from '../FinancialSheet';
import {
  IItem,
  IInventoryValuationReportQuery,
  IInventoryValuationItem,
  InventoryCostLotTracker,
  IInventoryValuationStatement,
  IInventoryValuationTotal
} from 'interfaces';
import { transformToMap } from 'utils'

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
  getItemTransaction(
    transactionsMap: Map<number, InventoryCostLotTracker[]>,
    itemId: number,
  ): { cost: number, quantity: number } {
    const meta = transactionsMap.get(itemId);

    const cost = get(meta, 'cost', 0);
    const quantity = get(meta, 'quantity', 0);

    return { cost, quantity };
  }

  /**
   * Retrieve the cost and quantity of the givne item from `IN` transactions.
   * @param {number} itemId -
   */
  getItemINTransaction(
    itemId: number,
  ): { cost: number, quantity: number } {
    return this.getItemTransaction(this.INInventoryCostLots, itemId);
  }

  /**
   * Retrieve the cost and quantity of the given item from `OUT` transactions.
   * @param {number} itemId - 
   */
  getItemOUTTransaction(
    itemId: number,
  ): { cost: number, quantity: number } {
    return this.getItemTransaction(this.OUTInventoryCostLots, itemId);
  }

  /**
   * Retrieve the item closing valuation.
   * @param {number} itemId - Item id.
   */
  getItemValuation(itemId: number): number {
    const { cost: INValuation } = this.getItemINTransaction(itemId);
    const { cost: OUTValuation } = this.getItemOUTTransaction(itemId);

    return Math.max(INValuation - OUTValuation, 0);
  }

  /**
   * Retrieve the item closing quantity. 
   * @param {number} itemId - Item id.
   */
  getItemQuantity(itemId: number): number {
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
  calcAverage(valuation: number, quantity: number): number {
    return quantity ? valuation / quantity : 0;
  }

  /**
   * Mapping the item model object to inventory valuation item
   * @param {IItem} item 
   * @returns {IInventoryValuationItem}
   */
  itemMapper(item: IItem): IInventoryValuationItem {
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
      currencyCode: this.baseCurrency
    };
  }

  /**
   * Retrieve the inventory valuation items.
   * @returns {IInventoryValuationItem[]}
   */
  itemsSection(): IInventoryValuationItem[] {
    return this.items.map(this.itemMapper.bind(this));
  }

  /**
   * Retrieve the inventory valuation total.
   * @param {IInventoryValuationItem[]} items 
   * @returns {IInventoryValuationTotal}
   */
  totalSection(items: IInventoryValuationItem[]): IInventoryValuationTotal {
    const valuation = sumBy(items, item => item.valuation);
    const quantity = sumBy(items, item => item.quantity);

    return {
      valuation,
      quantity,
      valuationFormatted: this.formatNumber(valuation),
      quantityFormatted: this.formatNumber(quantity, { money: false }),
    };
  }

  /**
   * Retrieve the inventory valuation report data.
   * @returns {IInventoryValuationStatement}
   */
  reportData(): IInventoryValuationStatement {
    const items = this.itemsSection();
    const total = this.totalSection(items);

    return { items, total };
  }
}