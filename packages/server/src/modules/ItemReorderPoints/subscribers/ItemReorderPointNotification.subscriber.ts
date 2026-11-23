import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { Knex } from 'knex';
import { events } from '@/common/events/events';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import {
  IInventoryTransactionsCreatedPayload,
  IInventoryTransactionsDeletedPayload,
} from '@/modules/InventoryCost/types/InventoryCost.types';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { runAfterTransaction } from '@/modules/Tenancy/TenancyDB/TransactionsHooks';
import {
  ItemReorderPointNotificationJob,
  ItemReorderPointNotificationQueue,
} from '../ItemReorderPoints.constants';
import { IItemReorderPointNotificationJobPayload } from '../ItemReorderPoints.types';
import { getChangedInventoryItemIds } from '../ItemReorderPoints.utils';

@Injectable()
export class ItemReorderPointNotificationSubscriber {
  private readonly logger = new Logger(
    ItemReorderPointNotificationSubscriber.name,
  );

  constructor(
    @InjectQueue(ItemReorderPointNotificationQueue)
    private readonly notificationQueue: Queue<IItemReorderPointNotificationJobPayload>,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Schedules a reorder-point check after inventory transactions are created.
   * @param {IInventoryTransactionsCreatedPayload} payload
   */
  @OnEvent(events.inventory.onInventoryTransactionsCreated)
  async handleInventoryTransactionsCreated({
    inventoryTransactions,
    trx,
  }: IInventoryTransactionsCreatedPayload) {
    await this.enqueueNotificationCheck(inventoryTransactions, trx);
  }

  /**
   * Schedules a reorder-point check after inventory transactions are deleted.
   * @param {IInventoryTransactionsDeletedPayload} payload
   */
  @OnEvent(events.inventory.onInventoryTransactionsDeleted)
  async handleInventoryTransactionsDeleted({
    oldInventoryTransactions,
    trx,
  }: IInventoryTransactionsDeletedPayload) {
    await this.enqueueNotificationCheck(oldInventoryTransactions, trx);
  }

  /**
   * Enqueues a notification check after the current transaction is committed.
   * @param {InventoryTransaction[]} transactions
   * @param {Knex.Transaction} trx
   */
  private async enqueueNotificationCheck(
    transactions: InventoryTransaction[],
    trx: Knex.Transaction,
  ) {
    const itemIds = getChangedInventoryItemIds(transactions);

    if (!itemIds.length) {
      return;
    }
    try {
      const { organizationId, userId } =
        await this.tenancyContext.getTenantJobPayload();

      runAfterTransaction(trx, async () => {
        try {
          await this.notificationQueue.add(
            ItemReorderPointNotificationJob,
            { itemIds, organizationId, userId },
            {
              removeOnComplete: true,
              attempts: 3,
              backoff: { type: 'exponential', delay: 5000 },
            },
          );
        } catch (error) {
          this.logger.error(
            'Failed to enqueue the item reorder point notification job.',
            error,
          );
        }
      });
    } catch (error) {
      this.logger.error(
        'Failed to prepare the item reorder point notification job.',
        error,
      );
    }
  }
}
