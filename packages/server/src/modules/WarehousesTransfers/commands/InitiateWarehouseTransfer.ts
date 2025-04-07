import { Knex } from 'knex';
import {
  IWarehouseTransferEditedPayload,
  IWarehouseTransferInitiatedPayload,
  IWarehouseTransferInitiatePayload,
} from '@/modules/Warehouses/Warehouse.types';
import { ERRORS } from '../constants';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { WarehouseTransfer } from '../models/WarehouseTransfer';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { events } from '@/common/events/events';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ModelObject } from 'objection';

@Injectable()
export class InitiateWarehouseTransfer {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(WarehouseTransfer.name)
    private readonly warehouseTransferModel: TenantModelProxy<
      typeof WarehouseTransfer
    >,
  ) {}

  /**
   * Validate the given warehouse transfer not already initiated.
   * @param {IWarehouseTransfer} warehouseTransfer
   */
  private validateWarehouseTransferNotAlreadyInitiated = (
    warehouseTransfer: ModelObject<WarehouseTransfer>,
  ) => {
    if (warehouseTransfer.transferInitiatedAt) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_ALREADY_INITIATED);
    }
  };

  /**
   * Initiate warehouse transfer.
   * @param   {number} warehouseTransferId
   * @returns {Promise<IWarehouseTransfer>}
   */
  public initiateWarehouseTransfer = async (
    warehouseTransferId: number,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    // Retrieves the old warehouse transfer transaction.
    const oldWarehouseTransfer = await this.warehouseTransferModel()
      .query()
      .findById(warehouseTransferId)
      .throwIfNotFound();

    // Validate the given warehouse transfer not already initiated.
    this.validateWarehouseTransferNotAlreadyInitiated(oldWarehouseTransfer);

    // Edits warehouse transfer transaction under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseTransferInitiate` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onInitiate, {
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferInitiatePayload);

      // Updates warehouse transfer graph on the storage.
      const warehouseTransferUpdated = await this.warehouseTransferModel()
        .query(trx)
        .findById(warehouseTransferId)
        .patch({
          transferInitiatedAt: new Date(),
        });
      // Fetches the warehouse transfer with entries.
      const warehouseTransfer = await this.warehouseTransferModel()
        .query(trx)
        .findById(warehouseTransferId)
        .withGraphFetched('entries');

      // Triggers `onWarehouseTransferEdit` event
      await this.eventPublisher.emitAsync(
        events.warehouseTransfer.onInitiated,
        {
          warehouseTransfer,
          oldWarehouseTransfer,
          trx,
        } as IWarehouseTransferInitiatedPayload,
      );
      return warehouseTransfer;
    });
  };
}
