import {
  InventoryTransaction,
  Item
} from '@/models';
import InventoryAverageCost from '@/services/Inventory/InventoryAverageCost';
import InventoryCostLotTracker from '@/services/Inventory/InventoryCostLotTracker';

type TCostMethod = 'FIFO' | 'LIFO' | 'AVG';

export default class InventoryService {
  /**
   * Computes the given item cost and records the inventory lots transactions
   * and journal entries based on the cost method FIFO, LIFO or average cost rate.
   * @param {Date} fromDate 
   * @param {number} itemId 
   */
  static async computeItemCost(fromDate: Date, itemId: number) {
    const costMethod: TCostMethod = 'FIFO';
    let costMethodComputer: IInventoryCostMethod;

    switch(costMethod) {
      case 'FIFO':
      case 'LIFO':
        costMethodComputer = new InventoryCostLotTracker(fromDate, itemId);
        break;
      case 'AVG':
        costMethodComputer = new InventoryAverageCost(fromDate, itemId);
        break
    }
    await costMethodComputer.initialize();
    await costMethodComputer.computeItemCost()
  }

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
    direction: string,
  ) {
    const storedOpers: any = [];
    const entriesItemsIds = entries.map((e: any) => e.item_id);
    const inventoryItems = await Item.tenant()
      .query()
      .whereIn('id', entriesItemsIds)
      .where('type', 'inventory');

    const inventoryItemsIds = inventoryItems.map((i: any) => i.id);

    // Filter the bill entries that have inventory items.
    const inventoryEntries = entries.filter(
      (entry: any) => inventoryItemsIds.indexOf(entry.item_id) !== -1
    );
    inventoryEntries.forEach((entry: any) => {
      const oper = InventoryTransaction.tenant().query().insert({
        date,
        direction,
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
}