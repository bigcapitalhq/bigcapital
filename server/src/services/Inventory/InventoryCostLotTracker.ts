import { omit, pick, chain } from 'lodash';
import moment from 'moment';
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
  inventoryINTrans: any;
  inventoryByItem: any;
  costLotsTransactions: IInventoryLotCost[];
  inTransactions: any[];
  outTransactions: IInventoryTransaction[];
  revertInvoiceTrans: any[];
  revertJEntriesTransactions: IInventoryTransaction[];

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
    // Collects journal entries reference id and type that should be reverted.
    this.revertInvoiceTrans = [];
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

    // Remove and revert accounts balance journal entries from inventory transactions.
    const revertJEntriesOper = this.revertJournalEntries(this.revertJEntriesTransactions);

    // Records the journal entries operation.
    this.recordJournalEntries(this.costLotsTransactions);

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
   * Fetched inventory transactions that has date from the starting date and
   * fetches availiable IN LOTs transactions that has remaining bigger than zero.
   * @private
   */
  private async fetchInvINTransactions() {
    const commonBuilder = (builder: any) => {
      builder.where('direction', 'IN');
      builder.orderBy('date', 'ASC');
      builder.where('item_id', this.itemId);
    };
    const afterInvTransactions: IInventoryTransaction[] =
      await InventoryTransaction.tenant()
        .query()
        .modify('filterDateRange', this.startingDate)  
        .orderBy('lot_number', (this.costMethod === 'LIFO') ? 'DESC' : 'ASC')
        .onBuild(commonBuilder)
        .withGraphFetched('item');

    const availiableINLots: IInventoryLotCost[] = 
      await InventoryLotCostTracker.tenant()
        .query()
        .modify('filterDateRange', null, this.startingDate)
        .orderBy('date', 'ASC')
        .orderBy('lot_number', 'ASC')        
        .onBuild(commonBuilder)
        .whereNot('remaining', 0);

    this.inTransactions = [
      ...availiableINLots.map((trans) => ({ lotTransId: trans.id, ...trans })),
      ...afterInvTransactions.map((trans) => ({ invTransId: trans.id, ...trans })),
    ];
  }

  /**
   * Fetches inventory OUT transactions that has date from the starting date.
   * @private
   */
  private async fetchInvOUTTransactions() {
    const afterOUTTransactions: IInventoryTransaction[] = 
      await InventoryTransaction.tenant()
        .query()
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
    const storedItems = await Item.tenant()
      .query()
      .where('type', 'inventory')
      .whereIn('id', itemsIds);

    this.itemsById = new Map(storedItems.map((item: any) => [item.id, item]));
  }

  /**
   * Fetch the inventory transactions that should revert its journal entries.
   * @private
   */
  private async fetchRevertInvJReferenceIds() {
    const revertJEntriesTransactions: IInventoryTransaction[] = 
      await InventoryTransaction.tenant()
        .query()
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
    const asyncOpers: any[] = [];
    const inventoryLotsTrans = await InventoryLotCostTracker.tenant()
      .query()
      .modify('filterDateRange', this.startingDate)
      .orderBy('date', 'DESC')
      .where('item_id', this.itemId)
      .where('direction', 'OUT');

    const deleteInvLotsTrans = InventoryLotCostTracker.tenant()
      .query()
      .modify('filterDateRange', this.startingDate)
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
    transactions: IInventoryLotCost[],
  ) {
    return this.journalCommands
      .revertEntriesFromInventoryTransactions(transactions);
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
          'date', 'rate', 'itemId', 'quantity', 'invTransId', 'lotTransId',
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

        this.costLotsTransactions.push({
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