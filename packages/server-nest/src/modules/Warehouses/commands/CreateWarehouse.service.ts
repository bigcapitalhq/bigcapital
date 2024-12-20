import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ICreateWarehouseDTO,
  IWarehouseCreatedPayload,
  IWarehouseCreatePayload,
} from '../Warehouse.types';
import { WarehouseValidator } from './WarehouseValidator.service';
import { Warehouse } from '../models/Warehouse.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class CreateWarehouse {
  /**
   * @param {UnitOfWork} uow - Unit of work.
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {WarehouseValidator} validator - Warehouse command validator.
   * @param {typeof Warehouse} warehouseModel - Warehouse model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
    private readonly validator: WarehouseValidator,

    @Inject(Warehouse.name)
    private readonly warehouseModel: typeof Warehouse,
  ) {}

  /**
   * Authorize the warehouse before creating.
   * @param {ICreateWarehouseDTO} warehouseDTO -
   */
  public authorize = async (warehouseDTO: ICreateWarehouseDTO) => {
    if (warehouseDTO.code) {
      await this.validator.validateWarehouseCodeUnique(warehouseDTO.code);
    }
  };

  /**
   * Creates a new warehouse on the system.
   * @param {ICreateWarehouseDTO} warehouseDTO
   */
  public createWarehouse = async (
    warehouseDTO: ICreateWarehouseDTO
  ): Promise<Warehouse> => {
    // Authorize warehouse before creating.
    await this.authorize(warehouseDTO);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseCreate` event.
      await this.eventEmitter.emitAsync(events.warehouse.onEdit, {
        warehouseDTO,
        trx,
      } as IWarehouseCreatePayload);

      // Creates a new warehouse on the storage.
      const warehouse = await this.warehouseModel.query(trx).insertAndFetch({
        ...warehouseDTO,
      });

      // Triggers `onWarehouseCreated` event.
      await this.eventEmitter.emitAsync(events.warehouse.onCreated, {
        warehouseDTO,
        warehouse,
        trx,
      } as IWarehouseCreatedPayload);

      return warehouse;
    });
  };
}
