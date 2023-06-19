import { get, isEmpty, sumBy } from 'lodash';
import * as R from 'ramda';
import FinancialSheet from '../FinancialSheet';
import { allPassedConditionsPass, transformToMap } from 'utils';
import {
  IAccountTransaction,
  IInventoryValuationTotal,
  IInventoryValuationItem,
  IInventoryValuationReportQuery,
  IInventoryValuationStatement,
  IItem,
} from '@/interfaces';

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
  getItemTransaction(itemId: number): {
    quantity: number;
    cost: number;
    average: number;
  } {
    const transaction = this.itemsTransactions.get(itemId);

    const quantity = get(transaction, 'quantity', 0);
    const cost = get(transaction, 'cost', 0);

    const average = cost / quantity;

    return { quantity, cost, average };
  }

  /**
   * Determines whether the purchase node is active.
   * @param {} node
   * @returns {boolean}
   */
  private filterPurchaseOnlyActive = (node) => {
    return node.quantityPurchased !== 0 && node.purchaseCost !== 0;
  };

  /**
   * Determines whether the purchase node is not none transactions.
   * @param node
   * @returns {boolean}
   */
  private filterPurchaseNoneTransaction = (node) => {
    const anyTransaction = this.itemsTransactions.get(node.id);

    return !isEmpty(anyTransaction);
  };

  /**
   * Filters sales by items nodes based on the report query.
   * @param {ISalesByItemsItem} saleItem -
   * @return {boolean}
   */
  private purchaseByItemFilter = (node): boolean => {
    const { noneTransactions, onlyActive } = this.query;

    const conditions = [
      [noneTransactions, this.filterPurchaseNoneTransaction],
      [onlyActive, this.filterPurchaseOnlyActive],
    ];
    return allPassedConditionsPass(conditions)(node);
  };

  /**
   * Mapping the given item section.
   * @param {IInventoryValuationItem} item
   * @returns
   */
  private itemSectionMapper = (item: IItem): IInventoryValuationItem => {
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
  };

  /**
   * Determines whether the items post filter is active.
   * @returns {boolean}
   */
  private isItemsPostFilter = (): boolean => {
    return isEmpty(this.query.itemsIds);
  };

  /**
   * Filters purchase by items nodes.
   * @param {} nodes -
   * @returns
   */
  private itemsFilter = (nodes) => {
    return nodes.filter(this.purchaseByItemFilter);
  };

  /**
   * Mappes purchase by items nodes.
   * @param items
   * @returns
   */
  private itemsMapper = (items) => {
    return items.map(this.itemSectionMapper);
  };

  /**
   * Retrieve the items sections.
   * @returns {IInventoryValuationItem[]}
   */
  private itemsSection = (): IInventoryValuationItem[] => {
    return R.compose(
      R.when(this.isItemsPostFilter, this.itemsFilter),
      this.itemsMapper
    )(this.items);
  };

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
      quantityPurchasedFormatted: this.formatTotalNumber(quantityPurchased, {
        money: false,
      }),
      purchaseCostFormatted: this.formatTotalNumber(purchaseCost),
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

    return items.length > 0 ? { items, total } : {};
  }
}
