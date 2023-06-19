import { Container, Service, Inject } from 'typedi';
import { pick } from 'lodash';
import config from '@/config';
import {
  IInventoryLotCost,
  IInventoryTransaction,
  TInventoryTransactionDirection,
  IItemEntry,
  IItemEntryTransactionType,
  IInventoryTransactionsCreatedPayload,
  IInventoryTransactionsDeletedPayload,
  IInventoryItemCostScheduledPayload,
} from '@/interfaces';
import InventoryAverageCost from '@/services/Inventory/InventoryAverageCost';
import InventoryCostLotTracker from '@/services/Inventory/InventoryCostLotTracker';
import TenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import { Knex } from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';

type TCostMethod = 'FIFO' | 'LIFO' | 'AVG';

@Service()
export default class InventoryService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  itemsEntriesService: ItemsEntriesService;

  @Inject()
  uow: UnitOfWork;

  /**
   * Transforms the items entries to inventory transactions.
   */
  transformItemEntriesToInventory(transaction: {
    transactionId: number;
    transactionType: IItemEntryTransactionType;
    transactionNumber?: string;

    exchangeRate?: number;

    warehouseId: number | null;

    date: Date | string;
    direction: TInventoryTransactionDirection;
    entries: IItemEntry[];
    createdAt: Date;
  }): IInventoryTransaction[] {
    const exchangeRate = transaction.exchangeRate || 1;

    return transaction.entries.map((entry: IItemEntry) => ({
      ...pick(entry, ['itemId', 'quantity']),
      rate: entry.rate * exchangeRate,
      transactionType: transaction.transactionType,
      transactionId: transaction.transactionId,
      direction: transaction.direction,
      date: transaction.date,
      entryId: entry.id,
      createdAt: transaction.createdAt,
      costAccountId: entry.costAccountId,

      warehouseId: entry.warehouseId || transaction.warehouseId,
      meta: {
        transactionNumber: transaction.transactionNumber,
        description: entry.description,
      },
    }));
  }

  async computeItemCost(tenantId: number, fromDate: Date, itemId: number) {
    return this.uow.withTransaction(tenantId, (trx: Knex.Transaction) => {
      return this.computeInventoryItemCost(tenantId, fromDate, itemId);
    });
  }

  /**
   * Computes the given item cost and records the inventory lots transactions
   * and journal entries based on the cost method FIFO, LIFO or average cost rate.
   * @param {number} tenantId - Tenant id.
   * @param {Date} fromDate - From date.
   * @param {number} itemId - Item id.
   */
  async computeInventoryItemCost(
    tenantId: number,
    fromDate: Date,
    itemId: number,
    trx?: Knex.Transaction
  ) {
    const { Item } = this.tenancy.models(tenantId);

    // Fetches the item with associated item category.
    const item = await Item.query().findById(itemId);

    // Cannot continue if the given item was not inventory item.
    if (item.type !== 'inventory') {
      throw new Error('You could not compute item cost has no inventory type.');
    }
    let costMethodComputer: IInventoryCostMethod;

    // Switch between methods based on the item cost method.
    switch ('AVG') {
      case 'FIFO':
      case 'LIFO':
        costMethodComputer = new InventoryCostLotTracker(
          tenantId,
          fromDate,
          itemId
        );
        break;
      case 'AVG':
        costMethodComputer = new InventoryAverageCost(
          tenantId,
          fromDate,
          itemId,
          trx
        );
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
  async scheduleComputeItemCost(
    tenantId: number,
    itemId: number,
    startingDate: Date | string
  ) {
    const agenda = Container.get('agenda');

    // Cancel any `compute-item-cost` in the queue has upper starting date
    // with the same given item.
    await agenda.cancel({
      name: 'compute-item-cost',
      nextRunAt: { $ne: null },
      'data.tenantId': tenantId,
      'data.itemId': itemId,
      'data.startingDate': { $gt: startingDate },
    });
    // Retrieve any `compute-item-cost` in the queue has lower starting date
    // with the same given item.
    const dependsJobs = await agenda.jobs({
      name: 'compute-item-cost',
      nextRunAt: { $ne: null },
      'data.tenantId': tenantId,
      'data.itemId': itemId,
      'data.startingDate': { $lte: startingDate },
    });
    if (dependsJobs.length === 0) {
      await agenda.schedule(
        config.scheduleComputeItemCost,
        'compute-item-cost',
        {
          startingDate,
          itemId,
          tenantId,
        }
      );
      // Triggers `onComputeItemCostJobScheduled` event.
      await this.eventPublisher.emitAsync(
        events.inventory.onComputeItemCostJobScheduled,
        { startingDate, itemId, tenantId } as IInventoryItemCostScheduledPayload
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
    transactions: IInventoryTransaction[],
    override: boolean = false,
    trx?: Knex.Transaction
  ): Promise<void> {
    const bulkInsertOpers = [];

    transactions.forEach((transaction: IInventoryTransaction) => {
      const oper = this.recordInventoryTransaction(
        tenantId,
        transaction,
        override,
        trx
      );
      bulkInsertOpers.push(oper);
    });
    const inventoryTransactions = await Promise.all(bulkInsertOpers);

    // Triggers `onInventoryTransactionsCreated` event.
    await this.eventPublisher.emitAsync(
      events.inventory.onInventoryTransactionsCreated,
      {
        tenantId,
        inventoryTransactions,
        trx,
      } as IInventoryTransactionsCreatedPayload
    );
  }

  /**
   * Writes the inventory transactions on the storage from the given
   * inventory transactions entries.
   *
   * @param {number} tenantId -
   * @param {IInventoryTransaction} inventoryEntry -
   * @param {boolean} deleteOld -
   */
  async recordInventoryTransaction(
    tenantId: number,
    inventoryEntry: IInventoryTransaction,
    deleteOld: boolean = false,
    trx: Knex.Transaction
  ): Promise<IInventoryTransaction> {
    const { InventoryTransaction } = this.tenancy.models(tenantId);

    if (deleteOld) {
      await this.deleteInventoryTransactions(
        tenantId,
        inventoryEntry.transactionId,
        inventoryEntry.transactionType,
        trx
      );
    }
    return InventoryTransaction.query(trx).insertGraph({
      ...inventoryEntry,
    });
  }

  /**
   * Records the inventory transactions from items entries that have (inventory) type.
   *
   * @param {number} tenantId
   * @param {number} transactionId
   * @param {string} transactionType
   * @param {Date|string} transactionDate
   * @param {boolean} override
   */
  async recordInventoryTransactionsFromItemsEntries(
    tenantId: number,
    transaction: {
      transactionId: number;
      transactionType: IItemEntryTransactionType;
      exchangeRate: number;

      date: Date | string;
      direction: TInventoryTransactionDirection;
      entries: IItemEntry[];
      createdAt: Date | string;

      warehouseId: number;
    },
    override: boolean = false,
    trx?: Knex.Transaction
  ): Promise<void> {
    // Can't continue if there is no entries has inventory items in the invoice.
    if (transaction.entries.length <= 0) {
      return;
    }
    // Inventory transactions.
    const inventoryTransactions =
      this.transformItemEntriesToInventory(transaction);

    // Records the inventory transactions of the given sale invoice.
    await this.recordInventoryTransactions(
      tenantId,
      inventoryTransactions,
      override,
      trx
    );
  }

  /**
   * Deletes the given inventory transactions.
   * @param {number} tenantId - Tenant id.
   * @param {string} transactionType
   * @param {number} transactionId
   * @return {Promise<{
   *    oldInventoryTransactions: IInventoryTransaction[]
   * }>}
   */
  async deleteInventoryTransactions(
    tenantId: number,
    transactionId: number,
    transactionType: string,
    trx?: Knex.Transaction
  ): Promise<{ oldInventoryTransactions: IInventoryTransaction[] }> {
    const { InventoryTransaction } = this.tenancy.models(tenantId);

    // Retrieve the inventory transactions of the given sale invoice.
    const oldInventoryTransactions = await InventoryTransaction.query(
      trx
    ).where({ transactionId, transactionType });

    // Deletes the inventory transactions by the given transaction type and id.
    await InventoryTransaction.query(trx)
      .where({ transactionType, transactionId })
      .delete();

    // Triggers `onInventoryTransactionsDeleted` event.
    await this.eventPublisher.emitAsync(
      events.inventory.onInventoryTransactionsDeleted,
      {
        tenantId,
        oldInventoryTransactions,
        transactionId,
        transactionType,
        trx,
      } as IInventoryTransactionsDeletedPayload
    );
    return { oldInventoryTransactions };
  }

  /**
   * Records the inventory cost lot transaction.
   * @param {number} tenantId
   * @param {IInventoryLotCost} inventoryLotEntry
   * @return {Promise<IInventoryLotCost>}
   */
  async recordInventoryCostLotTransaction(
    tenantId: number,
    inventoryLotEntry: IInventoryLotCost
  ): Promise<void> {
    const { InventoryCostLotTracker } = this.tenancy.models(tenantId);

    return InventoryCostLotTracker.query().insert({
      ...inventoryLotEntry,
    });
  }

  /**
   * Mark item cost computing is running.
   * @param {number} tenantId -
   * @param {boolean} isRunning -
   */
  async markItemsCostComputeRunning(
    tenantId: number,
    isRunning: boolean = true
  ) {
    const settings = this.tenancy.settings(tenantId);

    settings.set({
      key: 'cost_compute_running',
      group: 'inventory',
      value: isRunning,
    });
    await settings.save();
  }

  /**
   *
   * @param {number} tenantId
   * @returns
   */
  isItemsCostComputeRunning(tenantId) {
    const settings = this.tenancy.settings(tenantId);

    return settings.get({
      key: 'cost_compute_running',
      group: 'inventory',
    });
  }
}
