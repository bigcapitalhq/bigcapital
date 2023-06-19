import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import {
  IWarehouseTransfer,
  IWarehouseTransferTransferringPayload,
  IWarehouseTransferTransferredPayload,
} from '@/interfaces';
import { CommandWarehouseTransfer } from './CommandWarehouseTransfer';
import { ERRORS } from './constants';
import { ServiceError } from '@/exceptions';

@Service()
export class TransferredWarehouseTransfer extends CommandWarehouseTransfer {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Validate the warehouse transfer not already transferred.
   * @param {IWarehouseTransfer} warehouseTransfer
   */
  private validateWarehouseTransferNotTransferred = (
    warehouseTransfer: IWarehouseTransfer
  ) => {
    if (warehouseTransfer.transferDeliveredAt) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_ALREADY_TRANSFERRED);
    }
  };

  /**
   * Validate the warehouse transfer should be initiated.
   * @param {IWarehouseTransfer} warehouseTransfer
   */
  private validateWarehouseTransferShouldInitiated = (
    warehouseTransfer: IWarehouseTransfer
  ) => {
    if (!warehouseTransfer.transferInitiatedAt) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_NOT_INITIATED);
    }
  };

  /**
   * Transferred warehouse transfer.
   * @param   {number} tenantId
   * @param   {number} warehouseTransferId
   * @returns {Promise<IWarehouseTransfer>}
   */
  public transferredWarehouseTransfer = async (
    tenantId: number,
    warehouseTransferId: number
  ): Promise<IWarehouseTransfer> => {
    const { WarehouseTransfer } = this.tenancy.models(tenantId);

    // Retrieves the old warehouse transfer transaction.
    const oldWarehouseTransfer = await WarehouseTransfer.query()
      .findById(warehouseTransferId)
      .throwIfNotFound();

    // Validate the warehouse transfer not already transferred.
    this.validateWarehouseTransferNotTransferred(oldWarehouseTransfer);

    // Validate the warehouse transfer should be initiated.
    this.validateWarehouseTransferShouldInitiated(oldWarehouseTransfer);

    // Edits warehouse transfer transaction under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseTransferInitiate` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onTransfer, {
        tenantId,
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferTransferringPayload);

      // Updates warehouse transfer graph on the storage.
      const warehouseTransferUpdated = await WarehouseTransfer.query(trx)
        .findById(warehouseTransferId)
        .patch({
          transferDeliveredAt: new Date(),
        });
      // Fetches the warehouse transfer with entries.
      const warehouseTransfer = await WarehouseTransfer.query(trx)
        .findById(warehouseTransferId)
        .withGraphFetched('entries');

      // Triggers `onWarehouseTransferEdit` event
      await this.eventPublisher.emitAsync(
        events.warehouseTransfer.onTransferred,
        {
          tenantId,
          warehouseTransfer,
          oldWarehouseTransfer,
          trx,
        } as IWarehouseTransferTransferredPayload
      );
      return warehouseTransfer;
    });
  };
}
