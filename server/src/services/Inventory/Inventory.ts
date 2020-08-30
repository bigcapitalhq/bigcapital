import { Container, Service, Inject } from 'typedi';
import InventoryAverageCost from '@/services/Inventory/InventoryAverageCost';
import InventoryCostLotTracker from '@/services/Inventory/InventoryCostLotTracker';
import TenancyService from '@/services/Tenancy/TenancyService';

type TCostMethod = 'FIFO' | 'LIFO' | 'AVG';

@Service()
export default class InventoryService {
  @Inject()
  tenancy: TenancyService;

  /**
   * Computes the given item cost and records the inventory lots transactions
   * and journal entries based on the cost method FIFO, LIFO or average cost rate.
   * @param {number} tenantId -
   * @param {Date} fromDate -
   * @param {number} itemId -
   */
  async computeItemCost(tenantId: number, fromDate: Date, itemId: number) {
    const { Item } = this.tenancy.models(tenantId);

    const item = await Item.query()
      .findById(itemId)
      .withGraphFetched('category');

    // Cannot continue if the given item was not inventory item.
    if (item.type !== 'inventory') {
      throw new Error('You could not compute item cost has no inventory type.');
    }
    const costMethod: TCostMethod = item.category.costMethod;
    let costMethodComputer: IInventoryCostMethod;

    // Switch between methods based on the item cost method.
    switch(costMethod) {
      case 'FIFO':
      case 'LIFO':
        costMethodComputer = new InventoryCostLotTracker(fromDate, itemId);
        break;
      case 'AVG':
        costMethodComputer = new InventoryAverageCost(fromDate, itemId);
        break;
    }
    return costMethodComputer.computeItemCost();
  }

  /**
   * Schedule item cost compute job.
   * @param {number} tenantId
   * @param {number} itemId 
   * @param {Date} startingDate 
   */
  async scheduleComputeItemCost(tenantId: number, itemId: number, startingDate: Date|string) {
    const agenda = Container.get('agenda');

    return agenda.schedule('in 3 seconds', 'compute-item-cost', {
      startingDate, itemId, tenantId,
    });
  }

  /**
   * Records the inventory transactions. 
   * @param {number} tenantId - Tenant id.
   * @param {Bill} bill 
   * @param {number} billId 
   */
  async recordInventoryTransactions(
    tenantId: number,
    entries: [],
    deleteOld: boolean,
  ) {
    const { InventoryTransaction, Item } = this.tenancy.models(tenantId);

    const entriesItemsIds = entries.map((e: any) => e.item_id);
    const inventoryItems = await Item.query()
      .whereIn('id', entriesItemsIds)
      .where('type', 'inventory');

    const inventoryItemsIds = inventoryItems.map((i: any) => i.id);

    // Filter the bill entries that have inventory items.
    const inventoryEntries = entries.filter(
      (entry: any) => inventoryItemsIds.indexOf(entry.item_id) !== -1
    );
    inventoryEntries.forEach(async (entry: any) => {
      if (deleteOld) {
        await this.deleteInventoryTransactions(
          tenantId,
          entry.transactionId,
          entry.transactionType,
        );
      }
      await InventoryTransaction.query().insert({
        ...entry,
        lotNumber: entry.lotNumber,
      });
    });
  }

  /**
   * Deletes the given inventory transactions.
   * @param {number} tenantId - Tenant id.
   * @param {string} transactionType 
   * @param {number} transactionId 
   * @return {Promise}
   */
  deleteInventoryTransactions(
    tenantId: number,
    transactionId: number,
    transactionType: string,
  ) {
    const { InventoryTransaction } = this.tenancy.models(tenantId);

    return InventoryTransaction.query()
      .where('transaction_type', transactionType)
      .where('transaction_id', transactionId)
      .delete();
  }

  /**
   * Retrieve the lot number after the increment.
   * @param {number} tenantId - Tenant id.
   */
  async nextLotNumber(tenantId: number) {
    const { Option } = this.tenancy.models(tenantId);

    const LOT_NUMBER_KEY = 'lot_number_increment';
    const effectRows = await Option.query()
      .where('key', LOT_NUMBER_KEY)
      .increment('value', 1);

    if (effectRows === 0) {
      await Option.query()
        .insert({
          key: LOT_NUMBER_KEY,
          value: 1,
        });
    }
    const options = await Option.query();
    return options.getMeta(LOT_NUMBER_KEY, 1);
  }
}