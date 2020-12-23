import { Container, Service, Inject } from 'typedi';
import { pick } from 'lodash';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import { IInventoryTransaction, IItem, IItemEntry } from 'interfaces'
import InventoryAverageCost from 'services/Inventory/InventoryAverageCost';
import InventoryCostLotTracker from 'services/Inventory/InventoryCostLotTracker';
import TenancyService from 'services/Tenancy/TenancyService';
import events from 'subscribers/events';

type TCostMethod = 'FIFO' | 'LIFO' | 'AVG';

@Service()
export default class InventoryService {
  @Inject()
  tenancy: TenancyService;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  /**
   * Transforms the items entries to inventory transactions.
   */
  transformItemEntriesToInventory(
    itemEntries: IItemEntry[],
    transactionType: string,
    transactionId: number,
    direction: 'IN'|'OUT',
    date: Date|string,
    lotNumber: number,
  ) {
    return itemEntries.map((entry: IItemEntry) => ({
      ...pick(entry, ['itemId', 'quantity', 'rate']),
      lotNumber,
      transactionType,
      transactionId,
      direction,
      date,
      entryId: entry.id,
    }));
  }

  /**
   * Computes the given item cost and records the inventory lots transactions
   * and journal entries based on the cost method FIFO, LIFO or average cost rate.
   * @param {number} tenantId -
   * @param {Date} fromDate -
   * @param {number} itemId -
   */
  async computeItemCost(tenantId: number, fromDate: Date, itemId: number) {
    const { Item } = this.tenancy.models(tenantId);

    // Fetches the item with assocaited item category.
    const item = await Item.query().findById(itemId);

    // Cannot continue if the given item was not inventory item.
    if (item.type !== 'inventory') {
      throw new Error('You could not compute item cost has no inventory type.');
    }
    let costMethodComputer: IInventoryCostMethod;

    // Switch between methods based on the item cost method.
    switch('AVG') {
      case 'FIFO':
      case 'LIFO':
        costMethodComputer = new InventoryCostLotTracker(tenantId, fromDate, itemId);
        break;
      case 'AVG':
        costMethodComputer = new InventoryAverageCost(tenantId, fromDate, itemId);
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

    // Cancel any `compute-item-cost` in the queue has upper starting date 
    // with the same given item.
    await agenda.cancel({
      name: 'compute-item-cost',
      nextRunAt: { $ne: null },
      'data.tenantId': tenantId,
      'data.itemId': itemId,
      'data.startingDate': { "$gt": startingDate } 
    });

    // Retrieve any `compute-item-cost` in the queue has lower starting date
    // with the same given item.
    const dependsJobs = await agenda.jobs({
      name: 'compute-item-cost',
      nextRunAt: { $ne: null },
      'data.tenantId': tenantId,
      'data.itemId': itemId,
      'data.startingDate': { "$lte": startingDate }
    });
    if (dependsJobs.length === 0) {
      await agenda.schedule('in 30 seconds', 'compute-item-cost', {
        startingDate, itemId, tenantId,
      });

      // Triggers `onComputeItemCostJobScheduled` event.
      await this.eventDispatcher.dispatch(
        events.inventory.onComputeItemCostJobScheduled,
        { startingDate, itemId, tenantId },
      );
    }
  }

  /**
   * Records the inventory transactions. 
   * @param  {number} tenantId - Tenant id.
   * @param  {Bill} bill - Bill model object.
   * @param  {number} billId - Bill id.
   * @return {Promise<void>}
   */
  async recordInventoryTransactions(
    tenantId: number,
    inventoryEntries: IInventoryTransaction[],
    deleteOld: boolean,
  ): Promise<void> {
    inventoryEntries.forEach(async (entry: IInventoryTransaction) => {
      await this.recordInventoryTransaction(
        tenantId,
        entry,
        deleteOld,
      );
    });
  }

  /**
   * 
   * @param {number} tenantId 
   * @param {IInventoryTransaction} inventoryEntry 
   * @param {boolean} deleteOld 
   */
  async recordInventoryTransaction(
    tenantId: number,
    inventoryEntry: IInventoryTransaction,
    deleteOld: boolean = false,
  ) {
    const { InventoryTransaction, Item } = this.tenancy.models(tenantId);

    if (deleteOld) {
      await this.deleteInventoryTransactions(
        tenantId,
        inventoryEntry.transactionId,
        inventoryEntry.transactionType,
      );
    }
    await InventoryTransaction.query().insert({
      ...inventoryEntry,
      lotNumber: inventoryEntry.lotNumber,
    });
  }

  /**
   * Deletes the given inventory transactions.
   * @param {number} tenantId - Tenant id.
   * @param {string} transactionType 
   * @param {number} transactionId 
   * @return {Promise}
   */
  async deleteInventoryTransactions(
    tenantId: number,
    transactionId: number,
    transactionType: string,
  ): Promise<void> {
    const { InventoryTransaction } = this.tenancy.models(tenantId);

    await InventoryTransaction.query()
      .where('transaction_type', transactionType)
      .where('transaction_id', transactionId)
      .delete();
  }

  /**
   * Retrieve the lot number after the increment.
   * @param {number} tenantId - Tenant id.
   */
  getNextLotNumber(tenantId: number) {
    const settings = this.tenancy.settings(tenantId);

    const LOT_NUMBER_KEY = 'lot_number_increment';
    const storedLotNumber = settings.find({ key: LOT_NUMBER_KEY });

    return (storedLotNumber && storedLotNumber.value) ?
      parseInt(storedLotNumber.value, 10) : 1;
  }

  /**
   * Increment the next inventory LOT number.
   * @param {number} tenantId 
   * @return {Promise<number>}
   */
  async incrementNextLotNumber(tenantId: number) {
    const settings = this.tenancy.settings(tenantId);

    const LOT_NUMBER_KEY = 'lot_number_increment';
    const storedLotNumber = settings.find({ key: LOT_NUMBER_KEY });

    let lotNumber = 1;

    if (storedLotNumber && storedLotNumber.value) {
      lotNumber = parseInt(storedLotNumber.value, 10);
      lotNumber += 1;
    }
    settings.set({ key: LOT_NUMBER_KEY }, lotNumber);

    await settings.save();

    return lotNumber;
  }
}