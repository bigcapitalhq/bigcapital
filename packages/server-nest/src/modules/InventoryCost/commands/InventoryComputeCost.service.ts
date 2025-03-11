import { pick } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { Item } from '../../Items/models/Item';
import { SETTINGS_PROVIDER } from '../../Settings/Settings.types';
import { SettingsStore } from '../../Settings/SettingsStore';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { IItemEntryTransactionType } from '../../TransactionItemEntry/ItemEntry.types';
import { ModelObject } from 'objection';
import { ItemEntry } from '../../TransactionItemEntry/models/ItemEntry';
import { TInventoryTransactionDirection } from '../types/InventoryCost.types';
import { InventoryAverageCostMethodService } from './InventoryAverageCostMethod.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class InventoryComputeCostService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly inventoryAverageCostMethod: InventoryAverageCostMethodService,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,
  ) {}

  /**
   * Compute item cost.
   * @param {Date} fromDate - From date.
   * @param {number} itemId - Item id.
   * @returns {Promise<void>}
   */
  async computeItemCost(fromDate: Date, itemId: number) {
    return this.uow.withTransaction((trx: Knex.Transaction) => {
      return this.computeInventoryItemCost(fromDate, itemId, trx);
    });
  }

  /**
   * Computes the given item cost and records the inventory lots transactions
   * and journal entries based on the cost method FIFO, LIFO or average cost rate.
   * @param {Date} fromDate - From date.
   * @param {number} itemId - Item id.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  async computeInventoryItemCost(
    fromDate: Date,
    itemId: number,
    trx?: Knex.Transaction,
  ) {
    // Fetches the item with associated item category.
    const item = await this.itemModel().query().findById(itemId);

    // Cannot continue if the given item was not inventory item.
    if (item.type !== 'inventory') {
      throw new Error('You could not compute item cost has no inventory type.');
    }
    return this.inventoryAverageCostMethod.computeItemCost(
      fromDate,
      itemId,
      trx,
    );
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
    startingDate: Date | string,
  ) {
    // const agenda = Container.get('agenda');
    // const commonJobsQuery = {
    //   name: 'compute-item-cost',
    //   lastRunAt: { $exists: false },
    //   'data.tenantId': tenantId,
    //   'data.itemId': itemId,
    // };
    // // Cancel any `compute-item-cost` in the queue has upper starting date
    // // with the same given item.
    // await agenda.cancel({
    //   ...commonJobsQuery,
    //   'data.startingDate': { $lte: startingDate },
    // });
    // // Retrieve any `compute-item-cost` in the queue has lower starting date
    // // with the same given item.
    // const dependsJobs = await agenda.jobs({
    //   ...commonJobsQuery,
    //   'data.startingDate': { $gte: startingDate },
    // });
    // // If the depends jobs cleared.
    // if (dependsJobs.length === 0) {
    //   await agenda.schedule(
    //     this.config.get('inventory.scheduleComputeItemCost'),
    //     'compute-item-cost',
    //     {
    //       startingDate,
    //       itemId,
    //       tenantId,
    //     },
    //   );
    //   // Triggers `onComputeItemCostJobScheduled` event.
    //   await this.eventEmitter.emitAsync(
    //     events.inventory.onComputeItemCostJobScheduled,
    //     {
    //       startingDate,
    //       itemId,
    //       tenantId,
    //     } as IInventoryItemCostScheduledPayload,
    //   );
    // } else {
    //   // Re-schedule the jobs that have higher date from current moment.
    //   await Promise.all(
    //     dependsJobs.map((job) =>
    //       job
    //         .schedule(this.config.get('inventory.scheduleComputeItemCost'))
    //         .save(),
    //     ),
    //   );
    // }
  }

  /**
   * Mark item cost computing is running.
   * @param {boolean} isRunning -
   */
  async markItemsCostComputeRunning(isRunning: boolean = true) {
    const settings = await this.settingsStore();

    settings.set({
      key: 'cost_compute_running',
      group: 'inventory',
      value: isRunning,
    });
    await settings.save();
  }

  /**
   * Checks if the items cost compute is running.
   * @returns {boolean}
   */
  async isItemsCostComputeRunning() {
    const settings = await this.settingsStore();

    return (
      settings.get({
        key: 'cost_compute_running',
        group: 'inventory',
      }) ?? false
    );
  }
}
