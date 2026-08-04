import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as moment from 'moment';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { InventoryAdjustment } from '../models/InventoryAdjustment';
import {
  IInventoryAdjustmentEventPublishedPayload,
  IInventoryAdjustmentPublishingPayload,
} from '../types/InventoryAdjustments.types';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants/InventoryAdjustments.constants';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class PublishInventoryAdjustmentService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(InventoryAdjustment.name)
    private readonly inventoryAdjustmentModel: TenantModelProxy<
      typeof InventoryAdjustment
    >,
  ) {}

  /**
   * Publish the inventory adjustment transaction.
   * @param {number} inventoryAdjustmentId - Inventory adjustment ID.
   */
  public async publishInventoryAdjustment(
    inventoryAdjustmentId: number,
  ): Promise<void> {
    // Publishes inventory adjustment with associated inventory transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Validates the publish operation against the locked adjustment row.
      const oldInventoryAdjustment = await this.validate(
        inventoryAdjustmentId,
        trx,
      );

      await this.eventEmitter.emitAsync(
        events.inventoryAdjustment.onPublishing,
        {
          trx,
          oldInventoryAdjustment,
        } as IInventoryAdjustmentPublishingPayload,
      );

      // Publish the inventory adjustment transaction.
      await this.inventoryAdjustmentModel()
        .query(trx)
        .findById(inventoryAdjustmentId)
        .patch({
          publishedAt: moment().toMySqlDateTime(),
        });
      // Retrieve the inventory adjustment after the modification.
      const inventoryAdjustment = await this.inventoryAdjustmentModel()
        .query(trx)
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
   * Validates the publish inventory adjustment operation against the locked
   * adjustment row: existence and not already published.
   * @param {number} inventoryAdjustmentId - Inventory adjustment ID.
   * @param {Knex.Transaction} trx - Locks the adjustment row (FOR UPDATE).
   * @returns {Promise<InventoryAdjustment>} The locked adjustment.
   */
  async validate(
    inventoryAdjustmentId: number,
    trx: Knex.Transaction,
  ): Promise<InventoryAdjustment> {
    // Re-read the adjustment with a row lock to validate against current state.
    const oldInventoryAdjustment = await this.inventoryAdjustmentModel()
      .query(trx)
      .findById(inventoryAdjustmentId)
      .forUpdate()
      .throwIfNotFound();

    // Validate adjustment not already published against the locked row.
    this.validateAdjustmentTransactionsNotPublished(oldInventoryAdjustment);
    return oldInventoryAdjustment;
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
