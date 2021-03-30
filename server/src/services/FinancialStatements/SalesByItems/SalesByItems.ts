import { get, sumBy } from 'lodash';
import FinancialSheet from '../FinancialSheet';
import { transformToMap } from 'utils';
import {
  ISalesByItemsReportQuery,
  IAccountTransaction,
  ISalesByItemsItem,
  ISalesByItemsTotal,
  ISalesByItemsSheetStatement,
  IItem,
} from 'interfaces';

export default class SalesByItemsReport extends FinancialSheet {
  readonly baseCurrency: string;
  readonly items: IItem[];
  readonly itemsTransactions: Map<number, IAccountTransaction>;
  readonly query: ISalesByItemsReportQuery;

  /**
   * Constructor method.
   * @param {ISalesByItemsReportQuery} query 
   * @param {IItem[]} items 
   * @param {IAccountTransaction[]} itemsTransactions 
   * @param {string} baseCurrency 
   */
  constructor(
    query: ISalesByItemsReportQuery,
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
   * @param {number} itemId - Item id.
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
   * @param {ISalesByItemsItem} item 
   * @returns 
   */
  itemSectionMapper(item: IItem): ISalesByItemsItem {
    const meta = this.getItemTransaction(item.id);

    return {
      id: item.id,
      name: item.name,
      code: item.code,
      quantitySold: meta.quantity,
      soldCost: meta.cost,
      averageSellPrice: meta.average,
      quantitySoldFormatted: this.formatNumber(meta.quantity, {
        money: false,
      }),
      soldCostFormatted: this.formatNumber(meta.cost),
      averageSellPriceFormatted: this.formatNumber(meta.average),
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Retrieve the items sections.
   * @returns {ISalesByItemsItem[]}
   */
  itemsSection(): ISalesByItemsItem[] {
    return this.items.map(this.itemSectionMapper.bind(this));
  }

  /**
   * Retrieve the total section of the sheet.
   * @param {IInventoryValuationItem[]} items
   * @returns {IInventoryValuationTotal}
   */
  totalSection(items: ISalesByItemsItem[]): ISalesByItemsTotal {
    const quantitySold = sumBy(items, (item) => item.quantitySold);
    const soldCost = sumBy(items, (item) => item.soldCost);

    return {
      quantitySold,
      soldCost,
      quantitySoldFormatted: this.formatTotalNumber(quantitySold, {
        money: false,
      }),
      soldCostFormatted: this.formatTotalNumber(soldCost),
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Retrieve the sheet data.
   * @returns {ISalesByItemsSheetStatement}
   */
  reportData(): ISalesByItemsSheetStatement {
    const items = this.itemsSection();
    const total = this.totalSection(items);

    return items.length > 0 ? { items, total } : {};
  }
}
