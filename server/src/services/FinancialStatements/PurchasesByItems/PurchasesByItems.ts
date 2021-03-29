import { get, sumBy } from 'lodash';
import FinancialSheet from '../FinancialSheet';
import { transformToMap } from 'utils';
import {
  IAccountTransaction,
  IInventoryValuationTotal,
  IInventoryValuationItem,
  IInventoryValuationReportQuery,
  IInventoryValuationStatement,
  IItem,
} from 'interfaces';

export default class InventoryValuationReport extends FinancialSheet {
  readonly baseCurrency: string;
  readonly items: IItem[];
  readonly itemsTransactions: Map<number, IAccountTransaction>;
  readonly query: IInventoryValuationReportQuery;

  /**
   * Constructor method.
   * @param {IInventoryValuationReportQuery} query 
   * @param {IItem[]} items 
   * @param {IAccountTransaction[]} itemsTransactions 
   * @param {string} baseCurrency 
   */
  constructor(
    query: IInventoryValuationReportQuery,
    items: IItem[],
    itemsTransactions: IAccountTransaction[],
    baseCurrency: string
  ) {
    super();

    this.baseCurrency = baseCurrency;
    this.items = items;
    this.itemsTransactions = transformToMap(itemsTransactions, 'itemId');
    this.query = query;
    this.numberFormat = this.query.numberFormat;
  }

  /**
   * Retrieve the item purchase item, cost and average cost price.
   * @param {number} itemId
   */
  getItemTransaction(
    itemId: number
  ): { quantity: number; cost: number; average: number } {
    const transaction = this.itemsTransactions.get(itemId);

    const quantity = get(transaction, 'quantity', 0);
    const cost = get(transaction, 'cost', 0);

    const average = cost / quantity;

    return { quantity, cost, average };
  }

  /**
   * Mapping the given item section.
   * @param {IInventoryValuationItem} item 
   * @returns 
   */
  itemSectionMapper(item: IItem): IInventoryValuationItem {
    const meta = this.getItemTransaction(item.id);

    return {
      id: item.id,
      name: item.name,
      code: item.code,
      quantityPurchased: meta.quantity,
      purchaseCost: meta.cost,
      averageCostPrice: meta.average,
      quantityPurchasedFormatted: this.formatNumber(meta.quantity, {
        money: false,
      }),
      purchaseCostFormatted: this.formatNumber(meta.cost),
      averageCostPriceFormatted: this.formatNumber(meta.average),
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Retrieve the items sections.
   * @returns {IInventoryValuationItem[]}
   */
  itemsSection(): IInventoryValuationItem[] {
    return this.items.map(this.itemSectionMapper.bind(this));
  }

  /**
   * Retrieve the total section of the sheet.
   * @param {IInventoryValuationItem[]} items
   * @returns {IInventoryValuationTotal}
   */
  totalSection(items: IInventoryValuationItem[]): IInventoryValuationTotal {
    const quantityPurchased = sumBy(items, (item) => item.quantityPurchased);
    const purchaseCost = sumBy(items, (item) => item.purchaseCost);

    return {
      quantityPurchased,
      purchaseCost,
      quantityPurchasedFormatted: this.formatNumber(quantityPurchased, {
        money: false,
      }),
      purchaseCostFormatted: this.formatNumber(purchaseCost),
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Retrieve the sheet data.
   * @returns
   */
  reportData(): IInventoryValuationStatement {
    const items = this.itemsSection();
    const total = this.totalSection(items);

    return { items, total };
  }
}
