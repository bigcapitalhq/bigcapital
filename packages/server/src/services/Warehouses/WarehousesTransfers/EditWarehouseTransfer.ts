import { Service, Inject } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { Knex } from 'knex';
import events from '@/subscribers/events';
import {
  IEditWarehouseTransferDTO,
  IWarehouseTransfer,
  IWarehouseTransferEditPayload,
  IWarehouseTransferEditedPayload,
} from '@/interfaces';
import { CommandWarehouseTransfer } from './CommandWarehouseTransfer';

@Service()
export class EditWarehouseTransfer extends CommandWarehouseTransfer {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Edits warehouse transfer.
   * @param   {number} tenantId
   * @param   {number} warehouseTransferId
   * @param   {IEditWarehouseTransferDTO} editWarehouseDTO
   * @returns {Promise<IWarehouseTransfer>}
   */
  public editWarehouseTransfer = async (
    tenantId: number,
    warehouseTransferId: number,
    editWarehouseDTO: IEditWarehouseTransferDTO
  ): Promise<IWarehouseTransfer> => {
    const { WarehouseTransfer } = this.tenancy.models(tenantId);

    // Retrieves the old warehouse transfer transaction.
    const oldWarehouseTransfer = await WarehouseTransfer.query()
      .findById(warehouseTransferId)
      .throwIfNotFound();

    // Validate warehouse from and to should not be the same.
    this.validateWarehouseFromToNotSame(editWarehouseDTO);

    // Retrieves the from warehouse or throw not found service error.
    const fromWarehouse = await this.getFromWarehouseOrThrow(
      tenantId,
      editWarehouseDTO.fromWarehouseId
    );
    // Retrieves the to warehouse or throw not found service error.
    const toWarehouse = await this.getToWarehouseOrThrow(
      tenantId,
      editWarehouseDTO.toWarehouseId
    );
    // Validates the not found entries items ids.
    const items = await this.itemsEntries.validateItemsIdsExistence(
      tenantId,
      editWarehouseDTO.entries
    );
    // Validate the items entries should be inventory type.
    this.validateItemsShouldBeInventory(items);

    // Edits warehouse transfer transaction under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseTransferEdit` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onEdit, {
        tenantId,
        editWarehouseDTO,
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferEditPayload);

      // Updates warehouse transfer graph on the storage.
      const warehouseTransfer = await WarehouseTransfer.query(
        trx
      ).upsertGraphAndFetch({
        id: warehouseTransferId,
        ...editWarehouseDTO,
      });
      // Triggers `onWarehouseTransferEdit` event
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onEdited, {
        tenantId,
        editWarehouseDTO,
        warehouseTransfer,
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferEditedPayload);

      return warehouseTransfer;
    });
  };
}
