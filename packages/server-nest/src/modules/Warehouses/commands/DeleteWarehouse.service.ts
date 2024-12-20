import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IWarehouseDeletedPayload,
  IWarehouseDeletePayload,
} from '../Warehouse.types';
import { WarehouseValidator } from './WarehouseValidator.service';
import { ERRORS } from '../contants';
import { Warehouse } from '../models/Warehouse.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';

@Injectable()
export class DeleteWarehouseService {
  /**
   * @param {UnitOfWork} uow - Unit of work.
   * @param {EventEmitter2} eventPublisher - Event emitter.
   * @param {WarehouseValidator} validator - Warehouse command validator.
   * @param {typeof Warehouse} warehouseModel - Warehouse model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly validator: WarehouseValidator,

    @Inject(Warehouse.name)
    private readonly warehouseModel: typeof Warehouse,
  ) {}

  /**
   * Validates the given warehouse before deleting.
   * @param   {number} warehouseId
   * @returns {Promise<void>}
   */
  public authorize = async (warehouseId: number): Promise<void> => {
    await this.validator.validateWarehouseNotOnlyWarehouse(warehouseId);
  };

  /**
   * Deletes specific warehouse.
   * @param   {number} warehouseId
   * @returns {Promise<void>}
   */
  public deleteWarehouse = async (warehouseId: number): Promise<void> => {
    // Retrieves the old warehouse or throw not found service error.
    const oldWarehouse = await this.warehouseModel
      .query()
      .findById(warehouseId)
      .throwIfNotFound()
      .queryAndThrowIfHasRelations({
        type: ERRORS.WAREHOUSE_HAS_ASSOCIATED_TRANSACTIONS,
      });

    // Validates the given warehouse before deleting.
    await this.authorize(warehouseId);

    // Creates a new warehouse under unit-of-work.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const eventPayload = {
        warehouseId,
        oldWarehouse,
        trx,
      } as IWarehouseDeletePayload | IWarehouseDeletedPayload;

      // Triggers `onWarehouseCreate`.
      await this.eventPublisher.emitAsync(
        events.warehouse.onDelete,
        eventPayload,
      );
      // Deletes the given warehouse from the storage.
      await this.warehouseModel.query().findById(warehouseId).delete();

      // Triggers `onWarehouseCreated`.
      await this.eventPublisher.emitAsync(
        events.warehouse.onDeleted,
        eventPayload as IWarehouseDeletedPayload,
      );
    });
  };
}
