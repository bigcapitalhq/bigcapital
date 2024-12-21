import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { IEditWarehouseDTO, IWarehouse } from '../Warehouse.types';
import { WarehouseValidator } from './WarehouseValidator.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Warehouse } from '../models/Warehouse.model';
import { events } from '@/common/events/events';

@Injectable()
export class EditWarehouse {
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
   * Authorize the warehouse before deleting.
   */
  public authorize = async (
    warehouseDTO: IEditWarehouseDTO,
    warehouseId: number,
  ) => {
    if (warehouseDTO.code) {
      await this.validator.validateWarehouseCodeUnique(
        warehouseDTO.code,
        warehouseId,
      );
    }
  };

  /**
   * Edits a new warehouse on the system.
   * @param   {ICreateWarehouseDTO} warehouseDTO
   * @returns {Promise<IWarehouse>}
   */
  public editWarehouse = async (
    warehouseId: number,
    warehouseDTO: IEditWarehouseDTO,
  ): Promise<Warehouse> => {
    // Authorize the warehouse DTO before editing.
    await this.authorize(warehouseDTO, warehouseId);

    // Edits warehouse under unit-of-work.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseEdit` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdit, {
        warehouseId,
        warehouseDTO,
        trx,
      });
      // Updates the given branch on the storage.
      const warehouse = await this.warehouseModel
        .query()
        .patchAndFetchById(warehouseId, {
          ...warehouseDTO,
        });

      // Triggers `onWarehouseEdited` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdited, {
        warehouse,
        warehouseDTO,
        trx,
      });

      return warehouse;
    });
  };
}
