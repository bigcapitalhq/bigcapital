import { Queue } from 'bullmq';
import { ClsService } from 'nestjs-cls';
import Redis from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { Item } from '../../Items/models/Item';
import { SETTINGS_PROVIDER } from '../../Settings/Settings.types';
import { SettingsStore } from '../../Settings/SettingsStore';
import {
  ComputeItemCostQueue,
  ComputeItemCostQueueJob,
} from '../types/InventoryCost.types';
import { InventoryAverageCostMethodService } from './InventoryAverageCostMethod.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { InjectQueue } from '@nestjs/bullmq';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class InventoryComputeCostService {
  private readonly redisClient: Redis;

  /**
   * @param {UnitOfWork} uow - Unit of work.
   * @param {InventoryAverageCostMethodService} inventoryAverageCostMethod - Inventory average cost method.
   * @param {RedisService} redisService - Redis service.
   * @param {ClsService} clsService - Cls service.
   * @param {Queue} computeItemCostProcessor - Compute item cost processor.
   * @param {TenantModelProxy<typeof Item>} itemModel - Item model.
   * @param {() => SettingsStore} settingsStore - Settings store.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly inventoryAverageCostMethod: InventoryAverageCostMethodService,
    private readonly clsService: ClsService,
    private readonly redisService: RedisService,

    @InjectQueue(ComputeItemCostQueue)
    private readonly computeItemCostProcessor: Queue,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,
  ) {
    this.redisClient = this.redisService.getOrThrow();
  }

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
   * @param {number} itemId
   * @param {Date} startingDate
   */
  async scheduleComputeItemCost(itemId: number, startingDate: Date | string) {
    const debounceKey = `inventory-cost-compute-debounce:${itemId}`;
    const debounceTime = 1000 * 10; // 10 seconds

    // Generate a unique job ID or use a custom identifier
    const jobId = `task-${Date.now()}-${Math.random().toString(36).substring(2)}`;

    // Check if there's an existing debounced job
    const existingJobId = await this.redisClient.get(debounceKey);

    if (existingJobId) {
      // Attempt to remove or mark the previous job as skippable
      const existingJob =
        await this.computeItemCostProcessor.getJob(existingJobId);
      const state = await existingJob?.getState();

      if (existingJob && ['waiting', 'delayed'].includes(state)) {
        await existingJob.remove(); // Remove the previous job if it's still waiting
      }
    }
    const organizationId = this.clsService.get('organizationId');
    const userId = this.clsService.get('userId');

    // Add the new job with a delay (debounce period)
    const job = await this.computeItemCostProcessor.add(
      ComputeItemCostQueueJob,
      { itemId, startingDate, jobId, organizationId, userId },
      {
        jobId, // Custom job ID
        delay: debounceTime, // Delay execution by 1 minute
      },
    );
    // Store the latest job ID in Redis with an expiration
    await this.redisClient.set(debounceKey, jobId, 'PX', debounceTime);

    return { jobId, message: 'Task added with debounce' };
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
