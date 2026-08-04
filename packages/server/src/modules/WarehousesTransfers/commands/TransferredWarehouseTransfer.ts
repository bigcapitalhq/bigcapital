import { Knex } from 'knex';
import {
  IWarehouseTransferTransferingPayload,
  IWarehouseTransferTransferredPayload,
} from '@/modules/Warehouses/Warehouse.types';
import { CommandWarehouseTransfer } from './CommandWarehouseTransfer';
import { ERRORS } from '../constants';
import { Inject, Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';
import { WarehouseTransfer } from '../models/WarehouseTransfer';
import { ServiceError } from '../../Items/ServiceError';
import { events } from '@/common/events/events';
import { ModelObject } from 'objection';

@Injectable()
export class TransferredWarehouseTransfer {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(WarehouseTransfer.name)
    private readonly warehouseTransferModel: TenantModelProxy<
      typeof WarehouseTransfer
    >,
  ) {}

  /**
   * Validates the transferred warehouse transfer operation against the locked
   * transfer row: existence, not already transferred and should be initiated.
   * @param {number} warehouseTransferId - Warehouse transfer id.
   * @param {Knex.Transaction} trx - Locks the transfer row (FOR UPDATE).
   * @returns {Promise<ModelObject<WarehouseTransfer>>} The locked transfer.
   */
  validate = async (
    warehouseTransferId: number,
    trx: Knex.Transaction,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    // Re-read the transfer with a row lock to validate against current state.
    const oldWarehouseTransfer = await this.warehouseTransferModel()
      .query(trx)
      .findById(warehouseTransferId)
      .forUpdate()
      .throwIfNotFound();

    // Validate the warehouse transfer not already transferred.
    this.validateWarehouseTransferNotTransferred(oldWarehouseTransfer);

    // Validate the warehouse transfer should be initiated.
    this.validateWarehouseTranbsferShouldInitiated(oldWarehouseTransfer);
    return oldWarehouseTransfer;
  };

  /**
   * Validate the warehouse transfer not already transferred.
   * @param {IWarehouseTransfer} warehouseTransfer
   */
  private validateWarehouseTransferNotTransferred = (
    warehouseTransfer: ModelObject<WarehouseTransfer>,
  ) => {
    if (warehouseTransfer.transferDeliveredAt) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_ALREADY_TRANSFERRED);
    }
  };

  /**
   * Validate the warehouse transfer should be initiated.
   * @param {IWarehouseTransfer} warehouseTransfer
   */
  private validateWarehouseTranbsferShouldInitiated = (
    warehouseTransfer: ModelObject<WarehouseTransfer>,
  ) => {
    if (!warehouseTransfer.transferInitiatedAt) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_NOT_INITIATED);
    }
  };

  /**
   * Transferred warehouse transfer.
   * @param {number} warehouseTransferId
   * @returns {Promise<IWarehouseTransfer>}
   */
  public transferredWarehouseTransfer = async (
    warehouseTransferId: number,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    // Edits warehouse transfer transaction under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Validates the transferred operation against the locked transfer row.
      const oldWarehouseTransfer = await this.validate(
        warehouseTransferId,
        trx,
      );

      // Triggers `onWarehouseTransferInitiate` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onTransfer, {
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferTransferingPayload);

      // Updates warehouse transfer graph on the storage.
      const warehouseTransferUpdated = await this.warehouseTransferModel()
        .query(trx)
        .findById(warehouseTransferId)
        .patch({
          transferDeliveredAt: new Date(),
        });
      // Fetches the warehouse transfer with entries.
      const warehouseTransfer = await this.warehouseTransferModel()
        .query(trx)
        .findById(warehouseTransferId)
        .withGraphFetched('entries');

      // Triggers `onWarehouseTransferEdit` event
      await this.eventPublisher.emitAsync(
        events.warehouseTransfer.onTransferred,
        {
          warehouseTransfer,
          oldWarehouseTransfer,
          trx,
        } as IWarehouseTransferTransferredPayload,
      );
      return warehouseTransfer;
    });
  };
}
