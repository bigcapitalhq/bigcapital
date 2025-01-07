import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InventoryAdjustment } from '../models/InventoryAdjustment';
import { InventoryAdjustmentEntry } from '../models/InventoryAdjustmentEntry';
import {
  IInventoryAdjustmentEventPublishedPayload,
  IInventoryAdjustmentPublishingPayload,
} from '../types/InventoryAdjustments.types';
import { events } from '@/common/events/events';
import { Knex } from 'knex';
import { ServiceError } from '@/modules/Items/ServiceError';

export class PublishInventoryAdjustmentService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(InventoryAdjustment.name)
    private readonly inventoryAdjustmentModel: typeof InventoryAdjustment,

    @Inject(InventoryAdjustmentEntry.name)
    private readonly inventoryAdjustmentEntryModel: typeof InventoryAdjustmentEntry,
  ) {}

  /**
   * Publish the inventory adjustment transaction.
   * @param {number} tenantId
   * @param {number} inventoryAdjustmentId
   */
  public async publishInventoryAdjustment(
    inventoryAdjustmentId: number,
  ): Promise<void> {
    // Retrieve the inventory adjustment or throw not found service error.
    const oldInventoryAdjustment = await this.inventoryAdjustmentModel
      .query()
      .findById(inventoryAdjustmentId)
      .throwIfNotFound();

    // Validate adjustment not already published.
    this.validateAdjustmentTransactionsNotPublished(oldInventoryAdjustment);

    // Publishes inventory adjustment with associated inventory transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.eventEmitter.emitAsync(
        events.inventoryAdjustment.onPublishing,
        {
          trx,
          oldInventoryAdjustment,
        } as IInventoryAdjustmentPublishingPayload,
      );

      // Publish the inventory adjustment transaction.
      await InventoryAdjustment.query().findById(inventoryAdjustmentId).patch({
        publishedAt: moment().toMySqlDateTime(),
      });
      // Retrieve the inventory adjustment after the modification.
      const inventoryAdjustment = await InventoryAdjustment.query()
        .findById(inventoryAdjustmentId)
        .withGraphFetched('entries');

      // Triggers `onInventoryAdjustmentDeleted` event.
      await this.eventEmitter.emitAsync(
        events.inventoryAdjustment.onPublished,
        {
          inventoryAdjustmentId,
          inventoryAdjustment,
          oldInventoryAdjustment,
          trx,
        } as IInventoryAdjustmentEventPublishedPayload,
      );
    });
  }

  /**
   * Validate the adjustment transaction is exists.
   * @param {IInventoryAdjustment} inventoryAdjustment
   */
  private throwIfAdjustmentNotFound(inventoryAdjustment: InventoryAdjustment) {
    if (!inventoryAdjustment) {
      throw new ServiceError(ERRORS.INVENTORY_ADJUSTMENT_NOT_FOUND);
    }
  }

  /**
   * Validates the adjustment transaction is not already published.
   * @param {IInventoryAdjustment} oldInventoryAdjustment
   */
  private validateAdjustmentTransactionsNotPublished(
    oldInventoryAdjustment: InventoryAdjustment,
  ) {
    if (oldInventoryAdjustment.isPublished) {
      throw new ServiceError(ERRORS.INVENTORY_ADJUSTMENT_ALREADY_PUBLISHED);
    }
  }
}
