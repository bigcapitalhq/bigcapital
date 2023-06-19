import { pick, chain } from 'lodash';
import moment from 'moment';
import { IInventoryLotCost, IInventoryTransaction } from "interfaces";
import InventoryCostMethod from '@/services/Inventory/InventoryCostMethod';

type TCostMethod = 'FIFO' | 'LIFO';

export default class InventoryCostLotTracker extends InventoryCostMethod implements IInventoryCostMethod {
  startingDate: Date;
  itemId: number;
  costMethod: TCostMethod;
  itemsById: Map<number, any>;
  inventoryINTrans: any;
  inventoryByItem: any;
  costLotsTransactions: IInventoryLotCost[];
  inTransactions: any[];
  outTransactions: IInventoryTransaction[];
  revertJEntriesTransactions: IInventoryTransaction[];

  /**
   * Constructor method.
   * @param {Date} startingDate -
   * @param {number} itemId -
   * @param {string} costMethod - 
   */
  constructor(
    tenantId: number,
    startingDate: Date,
    itemId: number,
    costMethod: TCostMethod = 'FIFO'
  ) {
    super(tenantId, startingDate, itemId);

    this.startingDate = startingDate;
    this.itemId = itemId;
    this.costMethod = costMethod;

    // Collect cost lots transactions to insert them to the storage in bulk.
    this.costLotsTransactions= [];
    // Collect inventory transactions by item id.
    this.inventoryByItem = {};
    // Collection `IN` inventory tranaction by transaction id.
    this.inventoryINTrans = {};
    // Collects `IN` transactions.
    this.inTransactions = [];
    // Collects `OUT` transactions.
    this.outTransactions = [];
  }

  /**
   * Computes items costs from the given date using FIFO or LIFO cost method.
   * -------- 
   * - Revert the inventory lots after the given date.
   * - Remove all the journal entries from the inventory transactions
   *   after the given date.
   * - Re-tracking the inventory lots from inventory transactions.
   * - Re-write the journal entries from the given inventory transactions.
   * @async
   * @return {void}
   */
  public async computeItemCost(): Promise<any> {
    await this.revertInventoryLots(this.startingDate);
    await this.fetchInvINTransactions();
    await this.fetchInvOUTTransactions(); 
    await this.fetchRevertInvJReferenceIds();
    await this.fetchItemsMapped();

    this.trackingInventoryINLots(this.inTransactions);
    this.trackingInventoryOUTLots(this.outTransactions);

    // Re-tracking the inventory `IN` and `OUT` lots costs.
    const storedTrackedInvLotsOper = this.storeInventoryLotsCost(
      this.costLotsTransactions,
    );
    return Promise.all([
      storedTrackedInvLotsOper,
    ]);
  }

  /**
   * Fetched inventory transactions that has date from the starting date and
   * fetches available IN LOTs transactions that has remaining bigger than zero.
   * @private
   */
  private async fetchInvINTransactions() {
    const { InventoryTransaction, InventoryLotCostTracker } = this.tenantModels;

    const commonBuilder = (builder: any) => {
      builder.orderBy('date', (this.costMethod === 'LIFO') ? 'DESC': 'ASC');
      builder.where('item_id', this.itemId);
    };
    const afterInvTransactions: IInventoryTransaction[] =
      await InventoryTransaction.query()
        .modify('filterDateRange', this.startingDate)
        .orderByRaw("FIELD(direction, 'IN', 'OUT')")
        .onBuild(commonBuilder)
        .orderBy('lot_number', (this.costMethod === 'LIFO') ? 'DESC' : 'ASC')
        .withGraphFetched('item');

    const availableINLots: IInventoryLotCost[] = 
      await InventoryLotCostTracker.query()
        .modify('filterDateRange', null, this.startingDate)
        .orderBy('date', 'ASC')
        .where('direction', 'IN')
        .orderBy('lot_number', 'ASC')
        .onBuild(commonBuilder)
        .whereNot('remaining', 0);

    this.inTransactions = [
      ...availableINLots.map((trans) => ({ lotTransId: trans.id, ...trans })),
      ...afterInvTransactions.map((trans) => ({ invTransId: trans.id, ...trans })),
    ];
  }

  /**
   * Fetches inventory OUT transactions that has date from the starting date.
   * @private
   */
  private async fetchInvOUTTransactions() {
    const { InventoryTransaction } = this.tenantModels;

    const afterOUTTransactions: IInventoryTransaction[] = 
      await InventoryTransaction.query()
        .modify('filterDateRange', this.startingDate)
        .orderBy('date', 'ASC')
        .orderBy('lot_number', 'ASC')
        .where('item_id', this.itemId)
        .where('direction', 'OUT')
        .withGraphFetched('item');

    this.outTransactions = [ ...afterOUTTransactions ];
  }  

  private async fetchItemsMapped() {
    const itemsIds = chain(this.inTransactions).map((e) => e.itemId).uniq().value();
    const { Item } = this.tenantModels;
    const storedItems = await Item.query()
      .where('type', 'inventory')
      .whereIn('id', itemsIds);

    this.itemsById = new Map(storedItems.map((item: any) => [item.id, item]));
  }

  /**
   * Fetch the inventory transactions that should revert its journal entries.
   * @private
   */
  private async fetchRevertInvJReferenceIds() {
    const { InventoryTransaction } = this.tenantModels;
    const revertJEntriesTransactions: IInventoryTransaction[] = 
      await InventoryTransaction.query()
        .select(['transactionId', 'transactionType'])
        .modify('filterDateRange', this.startingDate)
        .where('direction', 'OUT')
        .where('item_id', this.itemId);

    this.revertJEntriesTransactions = revertJEntriesTransactions; 
  }

  /**
   * Revert the inventory lots to the given date by removing the inventory lots
   * transactions after the given date and increment the remaining that
   * associate to lot number.
   * @async
   * @return {Promise}
   */
  public async revertInventoryLots(startingDate: Date) {
    const { InventoryLotCostTracker } = this.tenantModels;
    const asyncOpers: any[] = [];
    const inventoryLotsTrans = await InventoryLotCostTracker.query()
      .modify('filterDateRange', this.startingDate)
      .orderBy('date', 'DESC')
      .where('item_id', this.itemId)
      .where('direction', 'OUT');

    const deleteInvLotsTrans = InventoryLotCostTracker.query()
      .modify('filterDateRange', this.startingDate)
      .where('item_id', this.itemId)      
      .delete();

    inventoryLotsTrans.forEach((inventoryLot: IInventoryLotCost) => {
      if (!inventoryLot.lotNumber) { return; }

      const incrementOper = InventoryLotCostTracker.query()
        .where('lot_number', inventoryLot.lotNumber)
        .where('direction', 'IN')
        .increment('remaining', inventoryLot.quantity);

      asyncOpers.push(incrementOper);
    });
    return Promise.all([deleteInvLotsTrans, ...asyncOpers]);
  }

  /**
   * Tracking inventory `IN` lots transactions.
   * @public
   * @param {IInventoryTransaction[]} inventoryTransactions -
   * @return {void}
   */
  public trackingInventoryINLots(
    inventoryTransactions: IInventoryTransaction[],
  ) {
    inventoryTransactions.forEach((transaction: IInventoryTransaction) => {
      const { itemId, id } = transaction;
      (this.inventoryByItem[itemId] || (this.inventoryByItem[itemId] = []));

      const commonLotTransaction: IInventoryLotCost = {
        ...pick(transaction, [
          'date', 'rate', 'itemId', 'quantity', 'invTransId', 'lotTransId',
          'direction', 'transactionType', 'transactionId', 'lotNumber', 'remaining'
        ]),
      };
      this.inventoryByItem[itemId].push(id);
      this.inventoryINTrans[id] = {
        ...commonLotTransaction,
        decrement: 0,
        remaining: commonLotTransaction.remaining || commonLotTransaction.quantity,
      };
      this.costLotsTransactions.push(this.inventoryINTrans[id]);
    });
  }

  /**
   * Tracking inventory `OUT` lots transactions.
   * @public
   * @param {IInventoryTransaction[]} inventoryTransactions -
   * @return {void}
   */
  public trackingInventoryOUTLots(
    inventoryTransactions: IInventoryTransaction[],
  ) {
    inventoryTransactions.forEach((transaction: IInventoryTransaction) => {
      const { itemId, id } = transaction;
      (this.inventoryByItem[itemId] || (this.inventoryByItem[itemId] = []));

      const commonLotTransaction: IInventoryLotCost = {
        ...pick(transaction, [
          'date', 'rate', 'itemId', 'quantity', 'invTransId', 'lotTransId', 'entryId',
          'direction', 'transactionType', 'transactionId', 'lotNumber', 'remaining'
        ]),
      };
      let invRemaining = transaction.quantity;
      const idsShouldDel: number[] = [];

      this.inventoryByItem?.[itemId]?.some((_invTransactionId: number) => {
        const _invINTransaction = this.inventoryINTrans[_invTransactionId];

        // Can't continue if the IN transaction remaining equals zero.
        if (invRemaining <= 0) { return true; }

        // Can't continue if the IN transaction date is after the current transaction date.
        if (moment(_invINTransaction.date).isAfter(transaction.date)) {
          return true;
        }
        // Determines the 'OUT' lot tranasctions whether bigger than 'IN' remaining transaction.
        const biggerThanRemaining = (_invINTransaction.remaining - transaction.quantity) > 0;
        const decrement = (biggerThanRemaining) ? transaction.quantity : _invINTransaction.remaining;
        const maxDecrement = Math.min(decrement, invRemaining);
        const cost = maxDecrement * _invINTransaction.rate;

        _invINTransaction.decrement += maxDecrement;
        _invINTransaction.remaining = Math.max(
          _invINTransaction.remaining - maxDecrement,
          0,
        );
        invRemaining = Math.max(invRemaining - maxDecrement, 0);

        this.costLotsTransactions.push({
          ...commonLotTransaction,
          cost,
          quantity: maxDecrement,
          lotNumber: _invINTransaction.lotNumber,
        });
        // Pop the 'IN' lots that has zero remaining. 
        if (_invINTransaction.remaining === 0) {
          idsShouldDel.push(_invTransactionId);
        }
        return false;
      });
      if (invRemaining > 0) {
        this.costLotsTransactions.push({ 
          ...commonLotTransaction,
          quantity: invRemaining,
        });
      }
      this.removeInventoryItems(itemId, idsShouldDel);
    });
  }

  /**
   * Remove inventory transactions for specific item id.
   * @private
   * @param {number} itemId 
   * @param {number[]} idsShouldDel 
   * @return {void}
   */
  private removeInventoryItems(itemId: number, idsShouldDel: number[]) {
    // Remove the IN transactions that has zero remaining amount.
    this.inventoryByItem[itemId] = this.inventoryByItem?.[itemId]
      ?.filter((transId: number) => idsShouldDel.indexOf(transId) === -1);
  }
}