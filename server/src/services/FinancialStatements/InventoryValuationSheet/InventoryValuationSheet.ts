import { sumBy, get } from 'lodash';
import FinancialSheet from '../FinancialSheet';
import {
  IItem,
  IInventoryValuationReportQuery,
  IInventoryValuationItem,
  IAccountTransaction,
  IInventoryValuationTotal
} from 'interfaces';
import { transformToMap } from 'utils'

export default class InventoryValuationSheet extends FinancialSheet {
  readonly query: IInventoryValuationReportQuery;
  readonly items: IItem[];
  readonly INInventoryCostLots: Map<number, IAccountTransaction>;
  readonly OUTInventoryCostLots: Map<number, IAccountTransaction>;
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
    INInventoryCostLots: IAccountTransaction[],
    OUTInventoryCostLots: IAccountTransaction[],
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

  getItemTransaction(
    transactionsMap,
    itemId: number,
  ): { cost: number, quantity: number } {
    const meta = transactionsMap.get(itemId);

    const cost = get(meta, 'cost', 0);
    const quantity = get(meta, 'cost', 0);

    return { cost, quantity };
  }

  getItemINTransaction(
    itemId: number,
  ): { cost: number, quantity: number } {
    return this.getItemTransaction(this.INInventoryCostLots, itemId);
  }

  getItemOUTTransaction(
    itemId: number,
  ): { cost: number, quantity: number } {
    return this.getItemTransaction(this.OUTInventoryCostLots, itemId);
  }

  getItemValuation(itemId: number): number {
    const { cost: INValuation } = this.getItemINTransaction(itemId);
    const { cost: OUTValuation } = this.getItemOUTTransaction(itemId);

    return INValuation - OUTValuation;
  }

  getItemQuantity(itemId: number): number {
    const { quantity: INQuantity } = this.getItemINTransaction(itemId);
    const { quantity: OUTQuantity } = this.getItemOUTTransaction(itemId);

    return INQuantity - OUTQuantity;
  }

  calcAverage(valuation: number, quantity: number): number {
    return quantity ? valuation / quantity : 0;
  }

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
   * 
   * @returns 
   */
  itemsSection() {
    return this.items.map(this.itemMapper.bind(this));
  }

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

  reportData() {
    const items = this.itemsSection();
    const total = this.totalSection(items);

    return { items, total };
  }
}