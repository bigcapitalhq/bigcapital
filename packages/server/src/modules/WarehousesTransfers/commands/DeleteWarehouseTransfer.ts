import { Knex } from 'knex';
import {
  IWarehouseTransferDeletedPayload,
  IWarehouseTransferDeletePayload,
} from '@/modules/Warehouses/Warehouse.types';
import { Inject, Injectable } from '@nestjs/common';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { events } from '@/common/events/events';
import { WarehouseTransfer } from '../models/WarehouseTransfer';
import { WarehouseTransferEntry } from '../models/WarehouseTransferEntry';

@Injectable()
export class DeleteWarehouseTransfer {
  /**
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {TenantModelProxy<WarehouseTransfer>} warehouseTransferModel - Warehouse transfer model.
   * @param {TenantModelProxy<WarehouseTransferEntry>} warehouseTransferEntryModel - Warehouse transfer entry model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(WarehouseTransfer.name)
    private readonly warehouseTransferModel: TenantModelProxy<
      typeof WarehouseTransfer
    >,
    @Inject(WarehouseTransferEntry.name)
    private readonly warehouseTransferEntryModel: TenantModelProxy<
      typeof WarehouseTransferEntry
    >,
  ) {}

  /**
   * Deletes warehouse transfer transaction.
   * @param {number} warehouseTransferId
   * @returns {Promise<void>}
   */
  public deleteWarehouseTransfer = async (
    warehouseTransferId: number,
  ): Promise<void> => {
    // Retrieve the old warehouse transfer or throw not found service error.
    const oldWarehouseTransfer = await this.warehouseTransferModel()
      .query()
      .findById(warehouseTransferId)
      .throwIfNotFound();

    // Deletes the warehouse transfer under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseTransferCreate` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onDelete, {
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferDeletePayload);

      // Delete warehouse transfer entries.
      await this.warehouseTransferEntryModel()
        .query(trx)
        .where('warehouseTransferId', warehouseTransferId)
        .delete();

      // Delete warehouse transfer.
      await this.warehouseTransferModel()
        .query(trx)
        .findById(warehouseTransferId)
        .delete();

      // Triggers `onWarehouseTransferDeleted` event
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onDeleted, {
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferDeletedPayload);
    });
  };
}
