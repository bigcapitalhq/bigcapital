import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import {
  IWarehouseTransfer,
  IWarehouseTransferEditedPayload,
  IWarehouseTransferInitiatePayload,
} from '@/interfaces';
import { CommandWarehouseTransfer } from './CommandWarehouseTransfer';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';

@Service()
export class InitiateWarehouseTransfer extends CommandWarehouseTransfer {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Validate the given warehouse transfer not already initiated.
   * @param {IWarehouseTransfer} warehouseTransfer
   */
  private validateWarehouseTransferNotAlreadyInitiated = (
    warehouseTransfer: IWarehouseTransfer
  ) => {
    if (warehouseTransfer.transferInitiatedAt) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_ALREADY_INITIATED);
    }
  };

  /**
   * Initiate warehouse transfer.
   * @param   {number} tenantId
   * @param   {number} warehouseTransferId
   * @returns {Promise<IWarehouseTransfer>}
   */
  public initiateWarehouseTransfer = async (
    tenantId: number,
    warehouseTransferId: number
  ): Promise<IWarehouseTransfer> => {
    const { WarehouseTransfer } = this.tenancy.models(tenantId);

    // Retrieves the old warehouse transfer transaction.
    const oldWarehouseTransfer = await WarehouseTransfer.query()
      .findById(warehouseTransferId)
      .throwIfNotFound(warehouseTransferId);

    // Validate the given warehouse transfer not already initiated.
    this.validateWarehouseTransferNotAlreadyInitiated(oldWarehouseTransfer);

    // Edits warehouse transfer transaction under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseTransferInitiate` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onInitiate, {
        tenantId,
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferInitiatePayload);

      // Updates warehouse transfer graph on the storage.
      const warehouseTransferUpdated = await WarehouseTransfer.query(trx)
        .findById(warehouseTransferId)
        .patch({
          transferInitiatedAt: new Date(),
        });
      // Fetches the warehouse transfer with entries.
      const warehouseTransfer = await WarehouseTransfer.query(trx)
        .findById(warehouseTransferId)
        .withGraphFetched('entries');

      // Triggers `onWarehouseTransferEdit` event
      await this.eventPublisher.emitAsync(
        events.warehouseTransfer.onInitiated,
        {
          tenantId,
          warehouseTransfer,
          oldWarehouseTransfer,
          trx,
        } as IWarehouseTransferEditedPayload
      );
      return warehouseTransfer;
    });
  };
}
