import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
  IInventoryAdjustmentDeletingPayload,
  IInventoryAdjustmentEventDeletedPayload,
} from '../types/InventoryAdjustments.types';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { InventoryAdjustmentEntry } from '../models/InventoryAdjustmentEntry';
import { InventoryAdjustment } from '../models/InventoryAdjustment';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteInventoryAdjustmentService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(InventoryAdjustment.name)
    private readonly inventoryAdjustmentModel: TenantModelProxy<
      typeof InventoryAdjustment
    >,

    @Inject(InventoryAdjustmentEntry.name)
    private readonly inventoryAdjustmentEntryModel: TenantModelProxy<
      typeof InventoryAdjustmentEntry
    >,
  ) {}

  /**
   * Deletes the inventory adjustment transaction.
   * @param {number} inventoryAdjustmentId - Inventory adjustment id.
   */
  public async deleteInventoryAdjustment(
    inventoryAdjustmentId: number,
  ): Promise<void> {
    // Retrieve the inventory adjustment or throw not found service error.
    const oldInventoryAdjustment = await this.inventoryAdjustmentModel()
      .query()
      .findById(inventoryAdjustmentId)
      .throwIfNotFound();

    // Deletes the inventory adjustment transaction and associated transactions
    // under unit-of-work env.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onInventoryAdjustmentDeleting` event.
      await this.eventEmitter.emitAsync(events.inventoryAdjustment.onDeleting, {
        oldInventoryAdjustment,
        trx,
      } as IInventoryAdjustmentDeletingPayload);

      // Deletes the inventory adjustment entries.
      await this.inventoryAdjustmentEntryModel()
        .query(trx)
        .where('adjustment_id', inventoryAdjustmentId)
        .delete();

      // Deletes the inventory adjustment transaction.
      await this.inventoryAdjustmentModel()
        .query(trx)
        .findById(inventoryAdjustmentId)
        .delete();

      // Triggers `onInventoryAdjustmentDeleted` event.
      await this.eventEmitter.emitAsync(events.inventoryAdjustment.onDeleted, {
        inventoryAdjustmentId,
        oldInventoryAdjustment,
        trx,
      } as IInventoryAdjustmentEventDeletedPayload);
    });
  }
}
