import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import {
  IWarehouseTransferDeletedPayload,
  IWarehouseTransferDeletePayload,
} from '@/interfaces';
import { CRUDWarehouseTransfer } from './CRUDWarehouseTransfer';

@Service()
export class DeleteWarehouseTransfer extends CRUDWarehouseTransfer {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Deletes warehouse transfer transaction.
   * @param   {number} tenantId
   * @param   {number} warehouseTransferId
   * @returns {Promise<void>}
   */
  public deleteWarehouseTransfer = async (
    tenantId: number,
    warehouseTransferId: number
  ): Promise<void> => {
    const { WarehouseTransfer, WarehouseTransferEntry } =
      this.tenancy.models(tenantId);

    // Retrieve the old warehouse transfer or throw not found service error.
    const oldWarehouseTransfer = await WarehouseTransfer.query()
      .findById(warehouseTransferId)
      .throwIfNotFound();

    // Deletes the warehouse transfer under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseTransferCreate` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onDelete, {
        tenantId,
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferDeletePayload);

      // Delete warehouse transfer entries.
      await WarehouseTransferEntry.query(trx)
        .where('warehouseTransferId', warehouseTransferId)
        .delete();

      // Delete warehouse transfer.
      await WarehouseTransfer.query(trx).findById(warehouseTransferId).delete();

      // Triggers `onWarehouseTransferDeleted` event
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onDeleted, {
        tenantId,
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferDeletedPayload);
    });
  };
}
