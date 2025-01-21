import * as R from 'ramda';
import * as moment from 'moment';
import { defaultTo, sumBy, get } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import {
  IInventoryDetailsQuery,
  IInventoryDetailsNumber,
  IInventoryDetailsDate,
  IInventoryDetailsData,
  IInventoryDetailsItem,
  IInventoryDetailsClosing,
  IInventoryDetailsOpening,
  IInventoryDetailsItemTransaction,
} from './InventoryItemDetails.types';
import { ModelObject } from 'objection';
import { Item } from '@/modules/Items/models/Item';
import {
  IFormatNumberSettings,
  INumberFormatQuery,
} from '../../types/Report.types';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { InventoryItemDetailsRepository } from './InventoryItemDetailsRepository';
import { TInventoryTransactionDirection } from '@/modules/InventoryCost/types/InventoryCost.types';
import { FinancialSheet } from '../../common/FinancialSheet';
import { filterDeep } from '@/utils/deepdash';
import { INodeTypes, MAP_CONFIG } from './constant';

export class InventoryDetails extends FinancialSheet {
  readonly repository: InventoryItemDetailsRepository;
  readonly query: IInventoryDetailsQuery;
  readonly numberFormat: INumberFormatQuery;
  readonly items: ModelObject<Item>[];
  readonly i18n: I18nService;

  /**
   * Constructor method.
   * @param {InventoryItemDetailsRepository} repository - The repository.
   * @param {I18nService} i18n - The i18n service.
   */
  constructor(
    filter: IInventoryDetailsQuery,
    repository: InventoryItemDetailsRepository,
    i18n: I18nService,
  ) {
    super();

    this.repository = repository;

    this.query = filter;
    this.numberFormat = this.query.numberFormat;
    this.i18n = i18n;
  }

  /**
   * Retrieve the number meta.
   * @param {number} number
   * @returns
   */
  public getNumberMeta(
    number: number,
    settings?: IFormatNumberSettings,
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
   * @retrun {IInventoryDetailsNumber}
   */
  public getTotalNumberMeta(
    number: number,
    settings?: IFormatNumberSettings,
  ): IInventoryDetailsNumber {
    return this.getNumberMeta(number, { excerptZero: false, ...settings });
  }

  /**
   * Retrieve the date meta.
   * @param {Date|string} date
   * @returns {IInventoryDetailsDate}
   */
  public getDateMeta(date: Date | string): IInventoryDetailsDate {
    return {
      formattedDate: moment(date).format('YYYY-MM-DD'),
      date: moment(date).toDate(),
    };
  }

  /**
   * Adjusts the movement amount.
   * @param {number} amount - The amount.
   * @param {TInventoryTransactionDirection} direction - The transaction direction.
   * @returns {number}
   */
  public adjustAmountMovement = R.curry(
    (direction: TInventoryTransactionDirection, amount: number): number => {
      return direction === 'OUT' ? amount * -1 : amount;
    },
  );

  /**
   * Accumulate and mapping running quantity on transactions.
   * @param {IInventoryDetailsItemTransaction[]} transactions
   * @returns {IInventoryDetailsItemTransaction[]}
   */
  public mapAccumTransactionsRunningQuantity(
    transactions: IInventoryDetailsItemTransaction[],
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
      transactions,
    )[1];
  }

  /**
   * Accumulate and mapping running valuation on transactions.
   * @param {IInventoryDetailsItemTransaction[]} transactions
   * @returns {IInventoryDetailsItemTransaction}
   */
  public mapAccumTransactionsRunningValuation(
    transactions: IInventoryDetailsItemTransaction[],
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
      transactions,
    )[1];
  }

  /**
   * Retrieve the inventory transaction total.
   * @param {ModelObject<InventoryTransaction>} transaction
   * @returns {number}
   */
  public getTransactionTotal = (
    transaction: ModelObject<InventoryTransaction>,
  ) => {
    return transaction.quantity
      ? transaction.quantity * transaction.rate
      : transaction.rate;
  };

  /**
   * Mappes the item transaction to inventory item transaction node.
   * @param {IItem} item
   * @param {IInvetoryTransaction} transaction
   * @returns {IInventoryDetailsItemTransaction}
   */
  public itemTransactionMapper(
    item: ModelObject<Item>,
    transaction: ModelObject<InventoryTransaction>,
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
      transactionType: this.i18n.t(transaction.transcationTypeFormatted),
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
   * Retrieve the inventory transcations by item id.
   * @param {number} itemId - The item id.
   * @returns {ModelObject<InventoryTransaction>[]}
   */
  public getInventoryTransactionsByItemId(
    itemId: number,
  ): ModelObject<InventoryTransaction>[] {
    return defaultTo(
      this.repository.inventoryTransactionsByItemId.get(itemId),
      [],
    );
  }

  /**
   * Retrieve the item transaction node by the given item.
   * @param {IItem} item
   * @returns {IInventoryDetailsItemTransaction[]}
   */
  public getItemTransactions(
    item: ModelObject<Item>,
  ): ModelObject<InventoryTransaction>[] {
    const transactions = this.getInventoryTransactionsByItemId(item.id);

    return R.compose(
      this.mapAccumTransactionsRunningQuantity.bind(this),
      this.mapAccumTransactionsRunningValuation.bind(this),
      R.map(R.curry(this.itemTransactionMapper.bind(this))(item)),
    )(transactions);
  }

  /**
   * Mappes the given item transactions.
   * @param {IItem} item -
   * @returns {(
   *    IInventoryDetailsItemTransaction
   *  | IInventoryDetailsOpening
   *  | IInventoryDetailsClosing
   *  )[]}
   */
  public itemTransactionsMapper(
    item: ModelObject<Item>,
  ): (
    | IInventoryDetailsItemTransaction
    | IInventoryDetailsOpening
    | IInventoryDetailsClosing
  )[] {
    const transactions = this.getItemTransactions(item);
    const openingValuation = this.getItemOpeingValuation(item);
    const closingValuation = this.getItemClosingValuation(
      item,
      transactions,
      openingValuation,
    );
    const hasTransactions = transactions.length > 0;
    const isItemHasOpeningBalance = this.isItemHasOpeningBalance(item.id);

    return R.pipe(
      R.concat(transactions),
      R.when(R.always(isItemHasOpeningBalance), R.prepend(openingValuation)),
      R.when(R.always(hasTransactions), R.append(closingValuation)),
    )([]);
  }

  /**
   * Detarmines the given item has opening balance transaction.
   * @param {number} itemId - Item id.
   * @return {boolean}
   */
  public isItemHasOpeningBalance(itemId: number): boolean {
    return !!this.repository.openingBalanceTransactionsByItemId.get(itemId);
  }

  /**
   * Retrieve the given item opening valuation.
   * @param {IItem} item -
   * @returns {IInventoryDetailsOpening}
   */
  public getItemOpeingValuation(
    item: ModelObject<Item>,
  ): IInventoryDetailsOpening {
    const openingBalance = this.repository.openingBalanceTransactionsByItemId.get(
      item.id,
    );
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
  public getItemClosingValuation(
    item: ModelObject<Item>,
    transactions: ModelObject<InventoryTransaction>[],
    openingValuation: IInventoryDetailsOpening,
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
  public itemsNodeMapper(item: ModelObject<Item>): IInventoryDetailsItem {
    return {
      id: item.id,
      name: item.name,
      code: item.code,
      nodeType: INodeTypes.ITEM,
      children: this.itemTransactionsMapper(item),
    };
  }

  /**
   * Detarmines the given node equals the given type.
   * @param {string} nodeType
   * @param {IItem} node
   * @returns {boolean}
   */
  public isNodeTypeEquals(
    nodeType: string,
    node: IInventoryDetailsItem,
  ): boolean {
    return nodeType === node.nodeType;
  }

  /**
   * Detarmines whether the given item node has transactions.
   * @param {IInventoryDetailsItem} item
   * @returns {boolean}
   */
  public isItemNodeHasTransactions(item: IInventoryDetailsItem) {
    return !!this.repository.inventoryTransactionsByItemId.get(item.id);
  }

  /**
   * Detarmines the filter
   * @param {IInventoryDetailsItem} item
   * @return {boolean}
   */
  public isFilterNode(item: IInventoryDetailsItem): boolean {
    return R.ifElse(
      R.curry(this.isNodeTypeEquals)(INodeTypes.ITEM),
      this.isItemNodeHasTransactions.bind(this),
      R.always(true),
    )(item);
  }

  /**
   * Filters items nodes.
   * @param {IInventoryDetailsItem[]} items -
   * @returns {IInventoryDetailsItem[]}
   */
  public filterItemsNodes(items: IInventoryDetailsItem[]) {
    const filtered = filterDeep(
      items,
      this.isFilterNode.bind(this),
      MAP_CONFIG,
    );
    return defaultTo(filtered, []);
  }

  /**
   * Retrieve the items nodes of the report.
   * @param {ModelObject<Item>[]} items
   * @returns {IInventoryDetailsItem[]}
   */
  public itemsNodes(items: ModelObject<Item>[]): IInventoryDetailsItem[] {
    return R.compose(
      this.filterItemsNodes.bind(this),
      R.map(this.itemsNodeMapper.bind(this)),
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
