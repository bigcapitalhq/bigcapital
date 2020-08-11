import { InventoryTransaction, Item } from '@/models';
import InventoryCostLotTracker from './InventoryCostLotTracker';
import { IInventoryTransaction, IInventoryLotCost } from '@/interfaces/InventoryTransaction';
import { IInventoryLotCost, IInventoryLotCost } from '../../interfaces/InventoryTransaction';
import { pick } from 'lodash';

export default class InventoryService {
  /**
   * Records the inventory transactions. 
   * @param {Bill} bill 
   * @param {number} billId 
   */
  static async recordInventoryTransactions(
    entries: [],
    date: Date,
    transactionType: string,
    transactionId: number,
  ) {
    const storedOpers: any = [];
    const entriesItemsIds = entries.map((e: any) => e.item_id);
    const inventoryItems = await Item.tenant()
      .query()
      .whereIn('id', entriesItemsIds)
      .where('type', 'inventory');

    const inventoryItemsIds = inventoryItems.map((i) => i.id);

    // Filter the bill entries that have inventory items.
    const inventoryEntries = entries.filter(
      (entry) => inventoryItemsIds.indexOf(entry.item_id) !== -1
    );
    inventoryEntries.forEach((entry: any) => {
      const oper = InventoryTransaction.tenant().query().insert({
        date,

        item_id: entry.item_id,
        quantity: entry.quantity,
        rate: entry.rate,

        transaction_type: transactionType,
        transaction_id: transactionId,
      });
      storedOpers.push(oper);
    });
    return Promise.all(storedOpers);
  }

  /**
   * Deletes the given inventory transactions.
   * @param {string} transactionType 
   * @param {number} transactionId 
   * @return {Promise}
   */
  static deleteInventoryTransactions(
    transactionId: number,
    transactionType: string,
  ) {
    return InventoryTransaction.tenant().query()
      .where('transaction_type', transactionType)
      .where('transaction_id', transactionId)
      .delete();
  }

  revertInventoryLotsCost(fromDate?: Date) {

  }

  /**
   * Records the journal entries transactions.
   * @param {IInventoryLotCost[]} inventoryTransactions -
   * 
   */
  static async recordJournalEntries(inventoryLots: IInventoryLotCost[]) {
    
  }

  /**
   * Tracking the given inventory transactions to lots costs transactions.
   * @param {IInventoryTransaction[]} inventoryTransactions - Inventory transactions. 
   * @return {IInventoryLotCost[]}
   */
  static async trackingInventoryLotsCost(inventoryTransactions: IInventoryTransaction[]) {
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
          'date', 'rate', 'itemId', 'quantity',
          'direction', 'transactionType', 'transactionId',
        ]),
      };
      // Record inventory `IN` cost lot transaction.
      if (transaction.direction === 'IN') { 
        inventoryByItem[itemId].push(id);
        inventoryINTrans[id] = {
          ...commonLotTransaction,
          remaining: commonLotTransaction.quantity,
        };
        costLotsTransactions.push(inventoryINTrans[id]);

      // Record inventory 'OUT' cost lots from 'IN' transactions.
      } else if (transaction.direction === 'OUT') {
        let invRemaining = transaction.quantity;

        inventoryByItem?.[itemId]?.forEach((
          _invTransactionId: number,
          index: number,
        ) => {
          const _invINTransaction = inventoryINTrans[_invTransactionId];

          // Detarmines the 'OUT' lot tranasctions whether bigger than 'IN' remaining transaction.
          const biggerThanRemaining = (_invINTransaction.remaining - transaction.quantity) > 0;
          const decrement = (biggerThanRemaining) ? transaction.quantity : _invINTransaction.remaining;

          _invINTransaction.remaining = Math.max(
            _invINTransaction.remaining - decrement, 0,
          );
          invRemaining = Math.max(invRemaining - decrement, 0);

          costLotsTransactions.push({
            ...commonLotTransaction,
            quantity: decrement,
          });
          // Pop the 'IN' lots that has zero remaining. 
          if (_invINTransaction.remaining === 0) {
            inventoryByItem?.[itemId].splice(index, 1);
          }
        });
        if (invRemaining > 0) { 
          costLotsTransactions.push({ 
            ...commonLotTransaction,
            quantity: invRemaining,
          });
        }
      }
    });
    return costLotsTransactions;
  }

}