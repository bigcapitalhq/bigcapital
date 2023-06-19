import * as R from 'ramda';
import { defaultTo, sumBy, get } from 'lodash';
import moment from 'moment';
import {
  IInventoryDetailsQuery,
  IItem,
  IInventoryTransaction,
  TInventoryTransactionDirection,
  IInventoryDetailsNumber,
  IInventoryDetailsDate,
  IInventoryDetailsData,
  IInventoryDetailsItem,
  IInventoryDetailsClosing,
  INumberFormatQuery,
  IInventoryDetailsOpening,
  IInventoryDetailsItemTransaction,
  IFormatNumberSettings,
} from '@/interfaces';
import FinancialSheet from '../FinancialSheet';
import { transformToMapBy, transformToMapKeyValue } from 'utils';
import { filterDeep } from 'utils/deepdash';

const MAP_CONFIG = { childrenPath: 'children', pathFormat: 'array' };

enum INodeTypes {
  ITEM = 'item',
  TRANSACTION = 'transaction',
  OPENING_ENTRY = 'OPENING_ENTRY',
  CLOSING_ENTRY = 'CLOSING_ENTRY',
}

export default class InventoryDetails extends FinancialSheet {
  readonly inventoryTransactionsByItemId: Map<number, IInventoryTransaction[]>;
  readonly openingBalanceTransactions: Map<number, IInventoryTransaction>;
  readonly query: IInventoryDetailsQuery;
  readonly numberFormat: INumberFormatQuery;
  readonly baseCurrency: string;
  readonly items: IItem[];

  /**
   * Constructor method.
   * @param {IItem[]} items - Items.
   * @param {IInventoryTransaction[]} inventoryTransactions - Inventory transactions.
   * @param {IInventoryDetailsQuery} query - Report query.
   * @param {string} baseCurrency - The base currency.
   */
  constructor(
    items: IItem[],
    openingBalanceTransactions: IInventoryTransaction[],
    inventoryTransactions: IInventoryTransaction[],
    query: IInventoryDetailsQuery,
    baseCurrency: string,
    i18n: any
  ) {
    super();

    this.inventoryTransactionsByItemId = transformToMapBy(
      inventoryTransactions,
      'itemId'
    );
    this.openingBalanceTransactions = transformToMapKeyValue(
      openingBalanceTransactions,
      'itemId'
    );
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.items = items;
    this.baseCurrency = baseCurrency;
    this.i18n = i18n;
  }

  /**
   * Retrieve the number meta.
   * @param {number} number
   * @returns
   */
  private getNumberMeta(
    number: number,
    settings?: IFormatNumberSettings
  ): IInventoryDetailsNumber {
    return {
      formattedNumber: this.formatNumber(number, {
        excerptZero: true,
        money: false,
        ...settings,
      }),
      number: number,
    };
  }

  /**
   * Retrieve the total number meta.
   * @param {number} number -
   * @param {IFormatNumberSettings} settings -
   * @return {IInventoryDetailsNumber}
   */
  private getTotalNumberMeta(
    number: number,
    settings?: IFormatNumberSettings
  ): IInventoryDetailsNumber {
    return this.getNumberMeta(number, { excerptZero: false, ...settings });
  }

  /**
   * Retrieve the date meta.
   * @param {Date|string} date
   * @returns {IInventoryDetailsDate}
   */
  private getDateMeta(date: Date | string): IInventoryDetailsDate {
    return {
      formattedDate: moment(date).format('YYYY-MM-DD'),
      date: moment(date).toDate(),
    };
  }

  /**
   * Adjusts the movement amount.
   * @param {number} amount
   * @param {TInventoryTransactionDirection} direction
   * @returns {number}
   */
  private adjustAmountMovement = R.curry(
    (direction: TInventoryTransactionDirection, amount: number): number => {
      return direction === 'OUT' ? amount * -1 : amount;
    }
  );

  /**
   * Accumulate and mapping running quantity on transactions.
   * @param {IInventoryDetailsItemTransaction[]} transactions
   * @returns {IInventoryDetailsItemTransaction[]}
   */
  private mapAccumTransactionsRunningQuantity(
    transactions: IInventoryDetailsItemTransaction[]
  ): IInventoryDetailsItemTransaction[] {
    const initial = this.getNumberMeta(0);

    const mapAccumAppender = (a, b) => {
      const total = a.runningQuantity.number + b.quantityMovement.number;
      const totalMeta = this.getNumberMeta(total, { excerptZero: false });
      const accum = { ...b, runningQuantity: totalMeta };

      return [accum, accum];
    };
    return R.mapAccum(
      mapAccumAppender,
      { runningQuantity: initial },
      transactions
    )[1];
  }

  /**
   * Accumulate and mapping running valuation on transactions.
   * @param {IInventoryDetailsItemTransaction[]} transactions
   * @returns {IInventoryDetailsItemTransaction}
   */
  private mapAccumTransactionsRunningValuation(
    transactions: IInventoryDetailsItemTransaction[]
  ): IInventoryDetailsItemTransaction[] {
    const initial = this.getNumberMeta(0);

    const mapAccumAppender = (a, b) => {
      const adjustment = b.direction === 'OUT' ? -1 : 1;
      const total = a.runningValuation.number + b.cost.number * adjustment;
      const totalMeta = this.getNumberMeta(total, { excerptZero: false });
      const accum = { ...b, runningValuation: totalMeta };

      return [accum, accum];
    };
    return R.mapAccum(
      mapAccumAppender,
      { runningValuation: initial },
      transactions
    )[1];
  }

  /**
   * Retrieve the inventory transaction total.
   * @param {IInventoryTransaction} transaction
   * @returns {number}
   */
  private getTransactionTotal = (transaction: IInventoryTransaction) => {
    return transaction.quantity
      ? transaction.quantity * transaction.rate
      : transaction.rate;
  };

  /**
   * Maps the item transaction to inventory item transaction node.
   * @param {IItem} item
   * @param {IInventoryTransaction} transaction
   * @returns {IInventoryDetailsItemTransaction}
   */
  private itemTransactionMapper(
    item: IItem,
    transaction: IInventoryTransaction
  ): IInventoryDetailsItemTransaction {
    const total = this.getTransactionTotal(transaction);
    const amountMovement = this.adjustAmountMovement(transaction.direction);

    // Quantity movement.
    const quantityMovement = amountMovement(transaction.quantity);
    const cost = get(transaction, 'costLotAggregated.cost', 0);

    // Profit margin.
    const profitMargin = total - cost;

    // Value from computed cost in `OUT` or from total sell price in `IN` transaction.
    const value = transaction.direction === 'OUT' ? cost : total;

    // Value movement depends on transaction direction.
    const valueMovement = amountMovement(value);

    return {
      nodeType: INodeTypes.TRANSACTION,
      date: this.getDateMeta(transaction.date),
      transactionType: this.i18n.__(transaction.transactionTypeFormatted),
      transactionNumber: transaction?.meta?.transactionNumber,
      direction: transaction.direction,

      quantityMovement: this.getNumberMeta(quantityMovement),
      valueMovement: this.getNumberMeta(valueMovement),

      quantity: this.getNumberMeta(transaction.quantity),
      total: this.getNumberMeta(total),

      rate: this.getNumberMeta(transaction.rate),
      cost: this.getNumberMeta(cost),
      value: this.getNumberMeta(value),

      profitMargin: this.getNumberMeta(profitMargin),

      runningQuantity: this.getNumberMeta(0),
      runningValuation: this.getNumberMeta(0),
    };
  }

  /**
   * Retrieve the inventory transactions by item id.
   * @param {number} itemId
   * @returns {IInventoryTransaction[]}
   */
  private getInventoryTransactionsByItemId(
    itemId: number
  ): IInventoryTransaction[] {
    return defaultTo(this.inventoryTransactionsByItemId.get(itemId + ''), []);
  }

  /**
   * Retrieve the item transaction node by the given item.
   * @param {IItem} item
   * @returns {IInventoryDetailsItemTransaction[]}
   */
  private getItemTransactions(item: IItem): IInventoryDetailsItemTransaction[] {
    const transactions = this.getInventoryTransactionsByItemId(item.id);

    return R.compose(
      this.mapAccumTransactionsRunningQuantity.bind(this),
      this.mapAccumTransactionsRunningValuation.bind(this),
      R.map(R.curry(this.itemTransactionMapper.bind(this))(item))
    )(transactions);
  }

  /**
   * Maps the given item transactions.
   * @param {IItem} item -
   * @returns {(
   *    IInventoryDetailsItemTransaction
   *  | IInventoryDetailsOpening
   *  | IInventoryDetailsClosing
   *  )[]}
   */
  private itemTransactionsMapper(
    item: IItem
  ): (
    | IInventoryDetailsItemTransaction
    | IInventoryDetailsOpening
    | IInventoryDetailsClosing
  )[] {
    const transactions = this.getItemTransactions(item);
    const openingValuation = this.getItemOpeningValuation(item);
    const closingValuation = this.getItemClosingValuation(
      item,
      transactions,
      openingValuation
    );
    const hasTransactions = transactions.length > 0;
    const isItemHasOpeningBalance = this.isItemHasOpeningBalance(item.id);

    return R.pipe(
      R.concat(transactions),
      R.when(R.always(isItemHasOpeningBalance), R.prepend(openingValuation)),
      R.when(R.always(hasTransactions), R.append(closingValuation))
    )([]);
  }

  /**
   * Determines the given item has opening balance transaction.
   * @param {number} itemId - Item id.
   * @return {boolean}
   */
  private isItemHasOpeningBalance(itemId: number): boolean {
    return !!this.openingBalanceTransactions.get(itemId);
  }

  /**
   * Retrieve the given item opening valuation.
   * @param {IItem} item -
   * @returns {IInventoryDetailsOpening}
   */
  private getItemOpeningValuation(item: IItem): IInventoryDetailsOpening {
    const openingBalance = this.openingBalanceTransactions.get(item.id);
    const quantity = defaultTo(get(openingBalance, 'quantity'), 0);
    const value = defaultTo(get(openingBalance, 'value'), 0);

    return {
      nodeType: INodeTypes.OPENING_ENTRY,
      date: this.getDateMeta(this.query.fromDate),
      quantity: this.getTotalNumberMeta(quantity),
      value: this.getTotalNumberMeta(value),
    };
  }

  /**
   * Retrieve the given item closing valuation.
   * @param {IItem} item -
   * @returns {IInventoryDetailsOpening}
   */
  private getItemClosingValuation(
    item: IItem,
    transactions: IInventoryDetailsItemTransaction[],
    openingValuation: IInventoryDetailsOpening
  ): IInventoryDetailsOpening {
    const value = sumBy(transactions, 'valueMovement.number');
    const quantity = sumBy(transactions, 'quantityMovement.number');
    const profitMargin = sumBy(transactions, 'profitMargin.number');

    const closingQuantity = quantity + openingValuation.quantity.number;
    const closingValue = value + openingValuation.value.number;

    return {
      nodeType: INodeTypes.CLOSING_ENTRY,
      date: this.getDateMeta(this.query.toDate),
      quantity: this.getTotalNumberMeta(closingQuantity),
      value: this.getTotalNumberMeta(closingValue),
      profitMargin: this.getTotalNumberMeta(profitMargin),
    };
  }

  /**
   * Retrieve the item node of the report.
   * @param {IItem} item
   * @returns {IInventoryDetailsItem}
   */
  private itemsNodeMapper(item: IItem): IInventoryDetailsItem {
    return {
      id: item.id,
      name: item.name,
      code: item.code,
      nodeType: INodeTypes.ITEM,
      children: this.itemTransactionsMapper(item),
    };
  }

  /**
   * Determines the given node equals the given type.
   * @param {string} nodeType
   * @param {IItem} node
   * @returns {boolean}
   */
  private isNodeTypeEquals(
    nodeType: string,
    node: IInventoryDetailsItem
  ): boolean {
    return nodeType === node.nodeType;
  }

  /**
   * Determines whether the given item node has transactions.
   * @param {IInventoryDetailsItem} item
   * @returns {boolean}
   */
  private isItemNodeHasTransactions(item: IInventoryDetailsItem) {
    return !!this.inventoryTransactionsByItemId.get(item.id);
  }

  /**
   * Determines the filter
   * @param {IInventoryDetailsItem} item
   * @return {boolean}
   */
  private isFilterNode(item: IInventoryDetailsItem): boolean {
    return R.ifElse(
      R.curry(this.isNodeTypeEquals)(INodeTypes.ITEM),
      this.isItemNodeHasTransactions.bind(this),
      R.always(true)
    )(item);
  }

  /**
   * Filters items nodes.
   * @param {IInventoryDetailsItem[]} items -
   * @returns {IInventoryDetailsItem[]}
   */
  private filterItemsNodes(items: IInventoryDetailsItem[]) {
    const filtered = filterDeep(
      items,
      this.isFilterNode.bind(this),
      MAP_CONFIG
    );
    return defaultTo(filtered, []);
  }

  /**
   * Retrieve the items nodes of the report.
   * @param {IItem} items
   * @returns {IInventoryDetailsItem[]}
   */
  private itemsNodes(items: IItem[]): IInventoryDetailsItem[] {
    return R.compose(
      this.filterItemsNodes.bind(this),
      R.map(this.itemsNodeMapper.bind(this))
    )(items);
  }

  /**
   * Retrieve the inventory item details report data.
   * @returns {IInventoryDetailsData}
   */
  public reportData(): IInventoryDetailsData {
    return this.itemsNodes(this.items);
  }
}
