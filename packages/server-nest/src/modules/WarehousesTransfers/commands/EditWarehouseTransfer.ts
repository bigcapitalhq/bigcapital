import { Knex } from 'knex';
import {
  IEditWarehouseTransferDTO,
  IWarehouseTransferEditPayload,
  IWarehouseTransferEditedPayload,
} from '@/modules/Warehouses/Warehouse.types';
import { CommandWarehouseTransfer } from './CommandWarehouseTransfer';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { WarehouseTransfer } from '../models/WarehouseTransfer';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { ModelObject } from 'objection';

@Injectable()
export class EditWarehouseTransfer {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly commandWarehouseTransfer: CommandWarehouseTransfer,
    private readonly itemsEntries: ItemsEntriesService,

    @Inject(WarehouseTransfer.name)
    private readonly warehouseTransferModel: TenantModelProxy<
      typeof WarehouseTransfer
    >,
  ) {}

  /**
   * Edits warehouse transfer.
   * @param {number} warehouseTransferId - Warehouse transfer id.
   * @param {IEditWarehouseTransferDTO} editWarehouseDTO -
   * @returns {Promise<ModelObject<WarehouseTransfer>>}
   */
  public editWarehouseTransfer = async (
    warehouseTransferId: number,
    editWarehouseDTO: IEditWarehouseTransferDTO,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    // Retrieves the old warehouse transfer transaction.
    const oldWarehouseTransfer = await this.warehouseTransferModel()
      .query()
      .findById(warehouseTransferId)
      .throwIfNotFound();

    // Validate warehouse from and to should not be the same.
    this.commandWarehouseTransfer.validateWarehouseFromToNotSame(
      editWarehouseDTO,
    );
    // Retrieves the from warehouse or throw not found service error.
    const fromWarehouse =
      await this.commandWarehouseTransfer.getFromWarehouseOrThrow(
        editWarehouseDTO.fromWarehouseId,
      );
    // Retrieves the to warehouse or throw not found service error.
    const toWarehouse =
      await this.commandWarehouseTransfer.getToWarehouseOrThrow(
        editWarehouseDTO.toWarehouseId,
      );
    // Validates the not found entries items ids.
    const items = await this.itemsEntries.validateItemsIdsExistance(
      editWarehouseDTO.entries,
    );
    // Validate the items entries should be inventory type.
    this.commandWarehouseTransfer.validateItemsShouldBeInventory(items);

    // Edits warehouse transfer transaction under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseTransferEdit` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onEdit, {
        editWarehouseDTO,
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferEditPayload);

      // Updates warehouse transfer graph on the storage.
      const warehouseTransfer = await this.warehouseTransferModel()
        .query(trx)
        .upsertGraphAndFetch({
          id: warehouseTransferId,
          ...editWarehouseDTO,
        });
      // Triggers `onWarehouseTransferEdit` event
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onEdited, {
        editWarehouseDTO,
        warehouseTransfer,
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferEditedPayload);

      return warehouseTransfer;
    });
  };
}
