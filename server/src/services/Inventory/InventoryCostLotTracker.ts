import { omit, pick, chain } from 'lodash';
import {
  InventoryTransaction,
  InventoryLotCostTracker,
  Account,
  Item,
} from "@/models";
import { IInventoryLotCost, IInventoryTransaction } from "@/interfaces";
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalCommands from '@/services/Accounting/JournalCommands';

type TCostMethod = 'FIFO' | 'LIFO';

export default class InventoryCostLotTracker implements IInventoryCostMethod {
  journal: JournalPoster;
  journalCommands: JournalCommands;
  startingDate: Date;
  headDate: Date;
  itemId: number;
  costMethod: TCostMethod;
  itemsById: Map<number, any>;

  /**
   * Constructor method.
   * @param {Date} startingDate -
   * @param {number} itemId -
   * @param {string} costMethod - 
   */
  constructor(startingDate: Date, itemId: number, costMethod: TCostMethod = 'FIFO') {
    this.startingDate = startingDate;
    this.itemId = itemId;
    this.costMethod = costMethod;
  }

  /**
   * Initialize the inventory average cost method.
   * @async
   */
  public async initialize() {
    const accountsDepGraph = await Account.tenant().depGraph().query();
    this.journal = new JournalPoster(accountsDepGraph);
    this.journalCommands = new JournalCommands(this.journal);
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

    const afterInvTransactions: IInventoryTransaction[] =
      await InventoryTransaction.tenant()
        .query()
        .where('date', '>=', this.startingDate)
        .orderBy('date', 'ASC')
        .orderBy('lot_number', 'ASC')
        .where('item_id', this.itemId)
        .withGraphFetched('item');

    const availiableINLots: IInventoryLotCost[] = 
      await InventoryLotCostTracker.tenant()
        .query()
        .where('date', '<', this.startingDate)
        .orderBy('date', 'ASC')
        .orderBy('lot_number', 'ASC')
        .where('item_id', this.itemId)
        .where('direction', 'IN')
        .whereNot('remaining', 0);

    const merged = [
      ...availiableINLots.map((trans) => ({ lotTransId: trans.id, ...trans })),
      ...afterInvTransactions.map((trans) => ({ invTransId: trans.id, ...trans })),
    ];
    const itemsIds = chain(merged).map(e => e.itemId).uniq().value();

    const storedItems = await Item.tenant()
      .query()
      .where('type', 'inventory')
      .whereIn('id', itemsIds);

    this.itemsById = new Map(storedItems.map((item: any) => [item.id, item]));

    // Re-tracking the inventory `IN` and `OUT` lots costs.
    const trackedInvLotsCosts = this.trackingInventoryLotsCost(merged);
    const storedTrackedInvLotsOper = this.storeInventoryLotsCost(trackedInvLotsCosts);

    // Remove and revert accounts balance journal entries from inventory transactions.
    const revertJEntriesOper = this.revertJournalEntries(afterInvTransactions);

    // Records the journal entries operation.
    this.recordJournalEntries(trackedInvLotsCosts);

    return Promise.all([
      storedTrackedInvLotsOper,
      revertJEntriesOper.then(() =>
        Promise.all([
          // Saves the new recorded journal entries to the storage.
          this.journal.deleteEntries(),
          this.journal.saveEntries(),
          this.journal.saveBalance(),   
        ])),
    ]);
  }

  /**
   * Revert the inventory lots to the given date by removing the inventory lots
   * transactions after the given date and increment the remaining that
   * associate to lot number.
   * @async
   * @return {Promise}
   */
  public async revertInventoryLots(startingDate: Date) {
    const asyncOpers: any[] = [];
    const inventoryLotsTrans = await InventoryLotCostTracker.tenant()
      .query()
      .orderBy('date', 'DESC')
      .where('item_id', this.itemId)
      .where('date', '>=', startingDate)
      .where('direction', 'OUT');

    const deleteInvLotsTrans = InventoryLotCostTracker.tenant()
      .query()
      .where('date', '>=', startingDate)
      .where('item_id', this.itemId)      
      .delete();

    inventoryLotsTrans.forEach((inventoryLot: IInventoryLotCost) => {
      if (!inventoryLot.lotNumber) { return; }

      const incrementOper = InventoryLotCostTracker.tenant()
        .query()
        .where('lot_number', inventoryLot.lotNumber)
        .where('direction', 'IN')
        .increment('remaining', inventoryLot.quantity);

      asyncOpers.push(incrementOper);
    });
    return Promise.all([deleteInvLotsTrans, ...asyncOpers]);
  }

  /**
   * Reverts the journal entries from inventory lots costs transaction.
   * @param {} inventoryLots 
   */
  async revertJournalEntries(
    inventoryLots: IInventoryLotCost[],
  ) {
    const invoiceTransactions = inventoryLots
      .filter(e => e.transactionType === 'SaleInvoice'); 

    return this.journalCommands
      .revertEntriesFromInventoryTransactions(invoiceTransactions);
  }
  
  /**
   * Records the journal entries transactions.
   * @async
   * @param {IInventoryLotCost[]} inventoryTransactions -
   * @param {string} referenceType -
   * @param {number} referenceId - 
   * @param {Date} date - 
   * @return {Promise}
   */
  public recordJournalEntries(
    inventoryLots: IInventoryLotCost[],
  ): void { 
    const outTransactions: any[] = [];
    const inTransByLotNumber: any = {};
    const transactions: any = [];

    inventoryLots.forEach((invTransaction: IInventoryLotCost) => {
      switch(invTransaction.direction) {
        case 'IN':
          inTransByLotNumber[invTransaction.lotNumber] = invTransaction;
          break;
        case 'OUT':
          outTransactions.push(invTransaction);
          break;
      }
    });
    outTransactions.forEach((outTransaction: IInventoryLotCost) => {
      const { lotNumber, quantity, rate, itemId } = outTransaction;
      const income = quantity * rate;
      const item = this.itemsById.get(itemId);

      const transaction = {
        date: outTransaction.date,
        referenceType: outTransaction.transactionType,
        referenceId: outTransaction.transactionId,
        cost: 0,
        income,
        incomeAccount: item.sellAccountId,
        costAccount: item.costAccountId,
        inventoryAccount: item.inventoryAccountId,
      };
      if (lotNumber && inTransByLotNumber[lotNumber]) {
        const inInvTrans = inTransByLotNumber[lotNumber];
        transaction.cost = (outTransaction.quantity * inInvTrans.rate);        
      }
      transactions.push(transaction);
    });
    this.journalCommands.inventoryEntries(transactions);
  }

  /**
   * Stores the inventory lots costs transactions in bulk.
   * @param {IInventoryLotCost[]} costLotsTransactions 
   * @return {Promise[]}
   */
  storeInventoryLotsCost(costLotsTransactions: IInventoryLotCost[]): Promise<object> {
    const opers: any = [];

    costLotsTransactions.forEach((transaction: IInventoryLotCost) => {
      if (transaction.lotTransId && transaction.decrement) {
        const decrementOper = InventoryLotCostTracker.tenant()
          .query()
          .where('id', transaction.lotTransId)
          .decrement('remaining', transaction.decrement);
        opers.push(decrementOper);
      } else if(!transaction.lotTransId) {
        const operation = InventoryLotCostTracker.tenant().query()
        .insert({
          ...omit(transaction, ['decrement', 'invTransId', 'lotTransId']),
        });
        opers.push(operation);
      }
    });
    return Promise.all(opers);
  }

  /**
   * Tracking the given inventory transactions to lots costs transactions.
   * @param {IInventoryTransaction[]} inventoryTransactions - Inventory transactions. 
   * @return {IInventoryLotCost[]}
   */
  public trackingInventoryLotsCost(
    inventoryTransactions: IInventoryTransaction[],
  ) : IInventoryLotCost {
    // Collect cost lots transactions to insert them to the storage in bulk.
    const costLotsTransactions: IInventoryLotCost[] = [];
    // Collect inventory transactions by item id.
    const inventoryByItem: any = {};
    // Collection `IN` inventory tranaction by transaction id.
    const inventoryINTrans: any = {};

    inventoryTransactions.forEach((transaction: IInventoryTransaction) => {
      const { itemId, id } = transaction;
      (inventoryByItem[itemId] || (inventoryByItem[itemId] = []));

      const commonLotTransaction: IInventoryLotCost = {
        ...pick(transaction, [
          'date', 'rate', 'itemId', 'quantity', 'invTransId', 'lotTransId',
          'direction', 'transactionType', 'transactionId', 'lotNumber', 'remaining'
        ]),
      };
      // Record inventory `IN` cost lot transaction.
      if (transaction.direction === 'IN') {
        inventoryByItem[itemId].push(id);
        inventoryINTrans[id] = {
          ...commonLotTransaction,
          decrement: 0,
          remaining: commonLotTransaction.remaining || commonLotTransaction.quantity,
        };
        costLotsTransactions.push(inventoryINTrans[id]);

      // Record inventory 'OUT' cost lots from 'IN' transactions.
      } else if (transaction.direction === 'OUT') {
        let invRemaining = transaction.quantity;
        const idsShouldDel: number[] = [];

        inventoryByItem?.[itemId]?.some((
          _invTransactionId: number,
        ) => {
          const _invINTransaction = inventoryINTrans[_invTransactionId];
          if (invRemaining <= 0) { return true; }

          // Detarmines the 'OUT' lot tranasctions whether bigger than 'IN' remaining transaction.
          const biggerThanRemaining = (_invINTransaction.remaining - transaction.quantity) > 0;
          const decrement = (biggerThanRemaining) ? transaction.quantity : _invINTransaction.remaining;
          const maxDecrement = Math.min(decrement, invRemaining);

          _invINTransaction.decrement += maxDecrement;
          _invINTransaction.remaining = Math.max(
            _invINTransaction.remaining - maxDecrement,
            0,
          );
          invRemaining = Math.max(invRemaining - maxDecrement, 0);

          costLotsTransactions.push({
            ...commonLotTransaction,
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
          costLotsTransactions.push({ 
            ...commonLotTransaction,
            quantity: invRemaining,
          });
        }
        // Remove the IN transactions that has zero remaining amount.
        inventoryByItem[itemId] = inventoryByItem?.[itemId]
          ?.filter((transId: number) => idsShouldDel.indexOf(transId) === -1);
      }
    });
    return costLotsTransactions;
  }

}